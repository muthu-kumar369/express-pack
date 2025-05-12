import cron from "node-cron";
import Redlock from "redlock";
import axios from "axios";
import { format } from "date-fns";
import { randomBytes } from "crypto";
import { logger } from "../../logger/winston/index.js";
import { RedisClientService } from "../redis/index.js";

export class CronManager {
  constructor({
    serviceName,
    redis,
    persistent,
    timezone,
    persistService,
    mongoClient,
  }) {
    this.serviceName = serviceName;
    this.logger = logger || console;
    this.redis = RedisClientService.getClient() || null;
    this.persistent = persistent;
    this.timezone = timezone;
    this.persistService = persistService;
    this.mongoClient = mongoClient;

    this.jobs = new Map();

    if (this.persistent && this.persistService === "redis") {
      this.redlock = new Redlock([this.redis], {
        retryCount: 3,
        retryDelay: 200,
        retryJitter: 200,
      });
      this.restoreJobsFromRedis();
    } else if (this.persistent && this.persistService === "mongodb") {
      this.db = mongoClient;
      this.restoreJobsFromMongo();
    }
  }

  generateUniqueId() {
    const timestamp = Date.now().toString(36);
    const randomString = randomBytes(6).toString("base64");
    return `${timestamp}-${randomString}`;
  }

  async trackJobState(jobName, state) {
    const timestamp = format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX");

    if (this.persistent && this.persistService === "redis") {
      await this.redis.hset(
        `cron:${this.serviceName}:jobStates`,
        jobName,
        JSON.stringify({ state, timestamp })
      );
    } else if (this.persistent && this.persistService === "mongodb") {
      await this.db
        .collection(`cron_${this.serviceName}_jobStates`)
        .updateOne(
          { jobName },
          { $set: { state, timestamp } },
          { upsert: true }
        );
    }
  }

  async getJobState(jobName) {
    if (this.persistent && this.persistService === "redis") {
      const jobState = await this.redis.hget(
        `cron:${this.serviceName}:jobStates`,
        jobName
      );
      return jobState ? JSON.parse(jobState) : null;
    } else if (this.persistent && this.persistService === "mongodb") {
      return await this.db
        .collection(`cron_${this.serviceName}_jobStates`)
        .findOne({ jobName });
    }
    return null;
  }

  async saveJobDefinition(name, cronExpression, apiConfig, options = {}) {
    const jobData = {
      name,
      cronExpression,
      apiConfig,
      options,
    };

    if (this.persistent && this.persistService === "redis") {
      await this.redis.hset(
        `cron:${this.serviceName}:jobDefs`,
        name,
        JSON.stringify(jobData)
      );
    } else if (this.persistent && this.persistService === "mongodb") {
      await this.db
        .collection(`cron_${this.serviceName}_jobDefs`)
        .updateOne({ name }, { $set: jobData }, { upsert: true });
    }
  }

  async restoreJobsFromRedis() {
    const jobDefs = await this.redis.hgetall(
      `cron:${this.serviceName}:jobDefs`
    );
    for (const [jobName, jobDataString] of Object.entries(jobDefs)) {
      const jobData = JSON.parse(jobDataString);
      if (this.jobs.has(jobData.name)) continue;
      this.registerJob(
        jobData.name,
        jobData.cronExpression,
        jobData.apiConfig,
        jobData.options
      );
    }
  }

  async restoreJobsFromMongo() {
    const jobDefs = await this.db
      .collection(`cron_${this.serviceName}_jobDefs`)
      .find({})
      .toArray();

    for (const jobData of jobDefs) {
      if (this.jobs.has(jobData.name)) continue;
      this.registerJob(
        jobData.name,
        jobData.cronExpression,
        jobData.apiConfig,
        jobData.options
      );
    }
  }

  registerJob(name, cronExpression, apiConfig, options = {}) {
    if (this.jobs.has(name)) {
      this.logger.warn(`Job "${name}" is already registered.`);
      return;
    }

    const { runOnInit = false, retry = 0, lockTimeout = 60000 } = options;

    const job = {
      name,
      cronExpression,
      apiConfig,
      options,
      scheduledTask: null,
      state: "pending",
    };

    const executeTask = async () => {
      const lockKey = `locks:${this.serviceName}:${name}`;
      let lock;

      try {
        if (this.redlock) {
          lock = await this.redlock.acquire([lockKey], lockTimeout);
        }

        let attempts = 0;
        while (attempts <= retry) {
          try {
            await this.trackJobState(name, "running");

            const response = await axios({
              method: apiConfig.method,
              url: apiConfig.url,
              headers: apiConfig.headers || {},
              data: apiConfig.data || {},
              params: apiConfig.params || {},
              timeout: apiConfig.timeout || 10000,
            });

            await this.trackJobState(name, "success");
            this.logger.info(`Job "${name}" executed: ${response.status}`);
            break;
          } catch (err) {
            attempts++;
            await this.trackJobState(name, "failed");
            this.logger.error(
              `Job "${name}" failed attempt ${attempts}: ${err.message}`
            );
            if (attempts > retry) {
              this.logger.error(`Job "${name}" failed after ${retry} retries.`);
            }
          }
        }
      } catch (lockError) {
        this.logger.warn(
          `Job "${name}" skipped due to lock acquisition failure.`
        );
      } finally {
        if (lock) {
          try {
            await lock.release();
          } catch (releaseError) {
            this.logger.error(
              `Failed to release lock for job "${name}": ${releaseError.message}`
            );
          }
        }
      }
    };

    const scheduledTask = cron.schedule(cronExpression, executeTask, {
      scheduled: true,
      timezone: this.timezone,
    });

    job.scheduledTask = scheduledTask;
    this.jobs.set(name, job);
    this.saveJobDefinition(name, cronExpression, apiConfig, options);

    if (runOnInit) {
      executeTask();
    }

    this.logger.info(
      `Job "${name}" registered to call "${apiConfig.url}" on schedule "${cronExpression}".`
    );
  }

  pauseJob(name) {
    const job = this.jobs.get(name);
    if (job && job.scheduledTask.running) {
      job.scheduledTask.stop();
      job.state = "paused";
      this.trackJobState(name, "paused");
      this.logger.info(`Job "${name}" paused.`);
    }
  }

  resumeJob(name) {
    const job = this.jobs.get(name);
    if (job && !job.scheduledTask.running && job.state === "paused") {
      job.scheduledTask.start();
      job.state = "running";
      this.trackJobState(name, "running");
      this.logger.info(`Job "${name}" resumed.`);
    }
  }

  startJob(name) {
    const job = this.jobs.get(name);
    if (job && !job.scheduledTask.running) {
      job.scheduledTask.start();
      job.state = "running";
      this.trackJobState(name, "running");
      this.logger.info(`Job "${name}" started.`);
    }
  }

  stopJob(name) {
    const job = this.jobs.get(name);
    if (job && job.scheduledTask.running) {
      job.scheduledTask.stop();
      job.state = "stopped";
      this.trackJobState(name, "stopped");
      this.logger.info(`Job "${name}" stopped.`);
    }
  }

  async removeJob(name) {
    const job = this.jobs.get(name);
    if (!job) return;

    job.scheduledTask.destroy();
    this.jobs.delete(name);

    if (this.persistent) {
      if (this.persistService === "redis") {
        await this.redis.hdel(`cron:${this.serviceName}:jobStates`, name);
        await this.redis.hdel(`cron:${this.serviceName}:jobDefs`, name);
      } else if (this.persistService === "mongodb") {
        await this.db
          .collection(`cron_${this.serviceName}_jobStates`)
          .deleteOne({ jobName: name });
        await this.db
          .collection(`cron_${this.serviceName}_jobDefs`)
          .deleteOne({ name });
      }
    }

    this.logger.info(`Job "${name}" removed.`);
  }

  listJobs() {
    return Array.from(this.jobs.keys());
  }
}
