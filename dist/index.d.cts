import jwt, { JwtPayload } from 'jsonwebtoken';
import { Strategy } from 'passport';
import { Application, Request, Response, NextFunction, RequestHandler, Router } from 'express';
import { OptionsJson, OptionsUrlencoded, Options, OptionsText } from 'body-parser';
import compression, { CompressionFilter, CompressionOptions } from 'compression';
import { CorsOptions } from 'cors';
import dotenv, { DotenvConfigOutput } from 'dotenv';
import { Logger } from 'winston';
import { rateLimit } from 'express-rate-limit';
import { HelmetOptions } from 'helmet';
import { ZodSchema } from 'zod';
import { Document, Model, Schema, IndexOptions } from 'mongoose';
import Redis from 'ioredis';
import { Db } from 'mongodb';
import { ScheduledTask } from 'node-cron';
import { Method } from 'axios';
import Redlock from 'redlock';
import { PutObjectCommandInput, PutObjectCommandOutput, DeleteObjectCommandOutput } from '@aws-sdk/client-s3';
import { DebouncedFunc } from 'lodash-es';

interface TokenPayload {
    payload: object;
    JWT_SECRET: string;
    expiresIn?: string | number;
}
interface RefreshTokenPayload {
    payload?: object;
    REFRESH_SECRET?: string;
    expiresIn?: string | number;
}
interface GenerateTokensParams {
    tokenPayload?: TokenPayload;
    refreshTokenPayload?: RefreshTokenPayload;
    generateRefreshToken?: boolean;
}
interface VerifyParams {
    token: string;
    JWT_SECRET?: string;
}
interface DecodeParams {
    token: string;
}
interface VerifyRefreshTokenParams {
    token: string;
    REFRESH_SECRET?: string;
}
interface RefreshAccessTokenParams {
    token: string;
    REFRESH_SECRET: string;
    JWT_SECRET: string;
}

declare class JWTUtil {
    static generateTokens({ tokenPayload, refreshTokenPayload, generateRefreshToken, }: GenerateTokensParams): Promise<string | {
        accessToken: string;
        refreshToken: string;
    }>;
    static generateRefreshToken({ payload, REFRESH_SECRET, expiresIn, }: RefreshTokenPayload): Promise<string>;
    static verify({ token, JWT_SECRET }: VerifyParams): Promise<string | jwt.JwtPayload>;
    static decode({ token }: DecodeParams): string | jwt.JwtPayload | null;
    static verifyRefreshToken({ token, REFRESH_SECRET, }: VerifyRefreshTokenParams): Promise<string | jwt.JwtPayload>;
    static refreshAccessToken({ token, REFRESH_SECRET, JWT_SECRET, }: RefreshAccessTokenParams): Promise<string | {
        accessToken: string;
        refreshToken: string;
    } | null>;
}

interface PassportStrategyConfig {
    name: string;
    strategy: Strategy;
}
type SerializeUserFn = (user: Express.User, done: (err: any, id?: unknown) => void) => void;
type DeserializeUserFn = (id: unknown, done: (err: any, user?: Express.User | false | null) => void) => void;

declare class PassportService {
    private static initialized;
    static init(config: {
        strategies: PassportStrategyConfig[];
        serializeUser?: SerializeUserFn;
        deserializeUser?: DeserializeUserFn;
    }): void;
    static initialize({ app }: {
        app: Application;
    }): void;
    static session({ app }: {
        app: Application;
    }): void;
}

interface AuthMiddlewareOptions {
    userAuth?: AuthenticateUserOptions;
    roleAuth?: AuthorizeRoleOptions;
    scopeAuth?: AuthorizeScopeOptions;
}
interface AuthenticateUserOptions {
    secret?: string;
    headerKey?: string;
    usingBearer?: boolean;
}
interface AuthorizeRoleOptions {
    allowedRoles?: string[];
    checkAll?: boolean;
}
interface AuthorizeScopeOptions {
    requiredScopes?: string[];
    checkAll?: boolean;
}
interface AuthenticatedRequest extends Request {
    req: Request;
    user?: JwtPayload | string | any;
}

declare class AuthMiddleware {
    static authenticateJWT({ userAuth, roleAuth, scopeAuth, }: AuthMiddlewareOptions): ((req: AuthenticatedRequest, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>) | ((req: Request, res: Response, next: NextFunction) => void);
    static authenticatePassport(strategy: string, options?: any, callback?: (...args: any[]) => any): any;
    static authenticateUser({ secret, headerKey, usingBearer, }: AuthenticateUserOptions): (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    static authorizeRole({ allowedRoles, checkAll, }: AuthorizeRoleOptions): (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    static authorizeScope({ requiredScopes, checkAll, }: AuthorizeScopeOptions): (req: AuthenticatedRequest, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
    static extractToken({ req, headerKey, usingBearer, }: {
        req: Request;
        headerKey?: string;
        usingBearer?: boolean;
    }): string | undefined;
}

type AsyncMiddleware = (req: Request, res: Response, next: NextFunction) => Promise<any> | void;

declare class AsyncRouteWrapper {
    static asyncHandler(fn: AsyncMiddleware): RequestHandler;
}

interface BodyParserInitParams {
    app: Application;
    customConfig?: BodyParserCustomConfig;
}
interface BodyParserCustomConfig {
    json?: OptionsJson;
    urlencoded?: OptionsUrlencoded;
    raw?: Options;
    text?: OptionsText;
}

declare class BodyParser {
    static init({ app, customConfig }: BodyParserInitParams): void;
}

interface CompressionInitParams {
    app: Application;
    customConfig?: CompressionCustomConfig;
}
interface CompressionCustomConfig {
    level?: number;
    threshold?: number | string;
    filter?: CompressionFilter;
}

declare class CompressionHandler {
    #private;
    static init({ app, customConfig }: CompressionInitParams): void;
    static getMiddleware(config?: CompressionOptions): ReturnType<typeof compression>;
    static isInitialized(): boolean;
}

type OriginPattern = string | boolean | RegExp;
type OriginCallback = (err: Error | null, allowedOrigin?: string | boolean | RegExp | (string | boolean | RegExp)[]) => void;
interface CorsCustomConfig extends Omit<CorsOptions, "origin"> {
    allowOrigins?: OriginPattern[];
    blockOrigins?: OriginPattern[];
    origin?: OriginPattern | OriginPattern[] | boolean | ((origin: string | undefined, callback: OriginCallback) => void);
}

declare class Cors {
    static defaultConfig: CorsOptions;
    static customConfig: CorsCustomConfig;
    static init({ app, customConfig, }: {
        app: any;
        customConfig?: Partial<CorsCustomConfig>;
    }): void;
    static getCorsConfig(): CorsOptions;
    static matchOrigin({ origin, pattern, }: {
        origin: string;
        pattern: string | RegExp;
    }): boolean;
}

declare class DotEnv {
    envLib: typeof dotenv;
    constructor();
    static init({ customPath }: {
        customPath?: string | undefined;
    }): DotenvConfigOutput["parsed"] | undefined;
}

declare class ErrorHandler {
    static handleGlobalError(err: Error, req: Request, res: Response, next: NextFunction): Response;
    static handleProcessError(): void;
    static handleNotFoundRoute(req: Request, res: Response, next: NextFunction): Response;
}

declare class TokenExpiredError extends Error {
    constructor(message?: string);
}
declare class TokenInvalidError extends Error {
    constructor(message?: string);
}
declare class TokenBlacklistedError extends Error {
    constructor(message?: string);
}

declare class LoggerHandler {
    #private;
    static init(customConfig?: Record<string, unknown>): void;
    static middleware(): (req: Request & {
        requestId?: string;
    }, res: Response, next: NextFunction) => void;
    static getLogger(): Logger;
    static isInitialized(): boolean;
}
declare const logger: Logger;

interface ExpressRateLimitInitOptions {
    app: Application;
    customConfig?: Partial<Parameters<typeof rateLimit>[0]>;
}

interface HelmetInitOptions {
    app: Application;
    customConfig?: Partial<HelmetOptions>;
}

declare class RateLimitHandler {
    #private;
    static init({ app, customConfig }: ExpressRateLimitInitOptions): void;
    static isInitialized(): boolean;
}

declare class SecurityHandler {
    static config: HelmetOptions;
    static init({ app, customConfig }: HelmetInitOptions): void;
}

type MiddlewareConfig = Record<string, any>;
interface Route {
    path: string;
    route: Router;
}
interface RouteGroup {
    prefix?: string;
    version?: string;
    route: Route[];
}

declare module "express-serve-static-core" {
    interface Request {
        requestId?: string | string[];
    }
}

declare class ExpressPack {
    #private;
    static init({ config, }: {
        config?: MiddlewareConfig;
    }): Promise<Application>;
    static getApp(): Application;
    static getRouter(): Router;
    static initRoutes({ routes }: {
        routes?: RouteGroup[];
    }): void;
    static isInitialized(): boolean;
}

declare class RequestTracer {
    static addRequestId(req: Request, res: Response, next: NextFunction): void;
}

interface ValidateRequestOptions {
    params?: ZodSchema<any>;
    query?: ZodSchema<any>;
    body?: ZodSchema<any>;
}
interface ValidatedRequest extends Request {
    data?: any;
}

declare class RequestValidator {
    static validateRequest({ params, query, body }: ValidateRequestOptions): (req: ValidatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
}

interface MultiTenancyOptions {
    field?: string;
}
interface PaginationOptions {
    page?: number;
    limit?: number;
    filter?: Record<string, any>;
    sort?: Record<string, any>;
}
interface PaginationResult<T> {
    results: T[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}
interface PaginationModel<T extends Document> extends Model<T> {
    paginate(opts?: PaginationOptions): Promise<PaginationResult<T>>;
}

declare class MongooseCorePlugin {
    static Timestamps(schema: Schema<any>): void;
    static SoftDelete(schema: Schema<any>, option: {}): void;
    static SlugGenerator(schema: Schema<any>, options?: {
        sourceField?: string;
        slugField?: string;
        unique?: boolean;
    }): void;
    static Versioning(schema: Schema<any>): void;
    static MultiTenancy(schema: Schema<any>, options?: MultiTenancyOptions): void;
    static Pagination(schema: Schema<any, PaginationModel<any>>): void;
}

interface IndexDefinition {
    field: string;
    type?: 1 | -1;
    options?: IndexOptions;
    name?: string;
}
interface IndexManagerOptions {
    indexes: IndexDefinition[];
}
interface RetryHandlerOptions {
    retries: number;
    delay: number;
}
type SchemaPlugin = (schema: Schema) => void;

declare class MongoosePerformancePlugin {
    static IndexManager(schema: Schema<any>, options?: IndexManagerOptions): SchemaPlugin;
    static RetryHandler(schema: Schema<any>, options?: RetryHandlerOptions): SchemaPlugin;
}

interface AutoPopulateOptions {
    paths: string[];
}
interface SmartPopulationField {
    select?: string | string[];
    populate?: string;
}
interface SmartPopulationFields {
    [field: string]: SmartPopulationField;
}
interface SmartPopulationOptions {
    maxDepth: number;
    fields: SmartPopulationFields;
}

declare class MongoosePopulatePlugin {
    static AutoPopulate(schema: Schema<any>, options?: AutoPopulateOptions): (schema: Schema) => void;
    static SmartPopulation(schema: Schema<any>, options?: SmartPopulationOptions): (schema: Schema) => void;
}

interface FieldEncryptionOptions {
    fields: string[];
}
interface UniqueConstraintOptions {
    fields: string[];
    messages?: {
        [field: string]: string;
    };
}
interface SchemaValidationOptions {
    validate: {
        [field: string]: ZodSchema<any>;
    };
}

declare class MongooseSecurityPlugin {
    static Sanitization(schema: Schema): void;
    static FieldEncryption(schema: Schema<any>, options?: FieldEncryptionOptions): void;
    static UniqueConstraint(schema: Schema, options: UniqueConstraintOptions): void;
    static SchemaValidation(schema: Schema<any>, options?: SchemaValidationOptions): void;
}

declare const availablePlugins: {
    timestamps: typeof MongooseCorePlugin.Timestamps;
    softDelete: typeof MongooseCorePlugin.SoftDelete;
    slugGenerator: typeof MongooseCorePlugin.SlugGenerator;
    versioning: typeof MongooseCorePlugin.Versioning;
    multiTenancy: typeof MongooseCorePlugin.MultiTenancy;
    pagination: typeof MongooseCorePlugin.Pagination;
    indexManager: typeof MongoosePerformancePlugin.IndexManager;
    retryHandler: typeof MongoosePerformancePlugin.RetryHandler;
    autoPopulate: typeof MongoosePopulatePlugin.AutoPopulate;
    smartPopulate: typeof MongoosePopulatePlugin.SmartPopulation;
    sanitize: typeof MongooseSecurityPlugin.Sanitization;
    fieldEncryption: typeof MongooseSecurityPlugin.FieldEncryption;
    uniqueConstraint: typeof MongooseSecurityPlugin.UniqueConstraint;
    schemaValidation: typeof MongooseSecurityPlugin.SchemaValidation;
};

interface AxiosHelperConfig {
    baseURL: string;
    timeout?: number;
    headers?: Record<string, string>;
}
interface AxiosRequestOptions {
    url: string;
    data?: any;
    headers?: Record<string, string>;
    params?: Record<string, any>;
    config?: Record<string, any>;
}

type PersistService = "redis" | "mongodb";
interface CronApiConfig {
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    url: string;
    headers?: Record<string, string>;
    data?: any;
    params?: Record<string, any>;
    timeout?: number;
}
interface JobOptions {
    runOnInit?: boolean;
    retry?: number;
    lockTimeout?: number;
}
interface CronJobDefinition {
    name: string;
    cronExpression: string;
    apiConfig: CronApiConfig;
    options?: JobOptions;
    scheduledTask?: ScheduledTask | null;
    state?: "pending" | "running" | "paused" | "success" | "failed" | "stopped";
}
interface CronManagerConstructorParams {
    serviceName: string;
    redis?: Redis | null;
    persistent?: boolean;
    timezone?: string;
    persistService?: PersistService;
    mongoClient?: Db;
}
declare module "node-cron" {
    interface ScheduledTask {
        running: boolean;
        destroy(): void;
    }
}

interface EmailTemplateParams {
    [key: string]: any;
}
interface EmailTemplate {
    subject: string;
    html: string;
}
interface GetTemplateParams {
    templateName: string;
    templateParams: EmailTemplateParams;
}
interface SendEmailParams {
    to: string;
    templateName: string;
    templateParams?: EmailTemplateParams;
}
interface Transporter {
    sendMail: (options: {
        from: string | undefined;
        to: string;
        subject: string;
        html: string;
    }) => Promise<any>;
}

interface S3Config {
    region?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
}
interface UploadFileParams extends Pick<PutObjectCommandInput, "Bucket" | "Key" | "Body" | "ContentType"> {
}
interface PresignedUrlParams {
    Bucket: string;
    Key: string;
    expiresIn?: number;
}
interface DeleteFileParams {
    Bucket: string;
    Key: string;
}

declare class NodeMailerService {
    static transporter: Transporter | null;
    static defaultFrom: string | undefined;
    static init(): void;
    static getTemplate({ templateName, templateParams, }: GetTemplateParams): Promise<EmailTemplate | undefined>;
    static sendEmail({ to, templateName, templateParams, }: SendEmailParams): Promise<any>;
}

interface TwilioSMSInitConfig {
    accountSid: string;
    authToken: string;
    fromNumber: string;
    templateDir?: string;
    logger?: (message: string, error?: any) => void;
}
interface TwilioSMSOptions {
    to: string;
    body: string;
}
interface TwilioTemplatedSMSOptions {
    to: string;
    template: string;
    dynamicData: Record<string, any>;
}

declare class SMSService {
    private static instance;
    private static client;
    private static fromNumber;
    private static logger;
    private constructor();
    static init(config: TwilioSMSInitConfig): void;
    static sendSMS(options: TwilioSMSOptions): Promise<void>;
    static sendTemplatedSMS(options: TwilioTemplatedSMSOptions): Promise<void>;
    private static renderTemplate;
}

declare class AxiosHelper {
    private static instance;
    private axiosInstance;
    private baseURL;
    private timeout;
    private headers;
    private constructor();
    static getInstance(config: AxiosHelperConfig): AxiosHelper;
    private handleResponse;
    private handleError;
    request(method: Method, options: AxiosRequestOptions): Promise<any>;
    get(options: Omit<AxiosRequestOptions, "data">): Promise<any>;
    post(options: AxiosRequestOptions): Promise<any>;
    put(options: AxiosRequestOptions): Promise<any>;
    patch(options: AxiosRequestOptions): Promise<any>;
    delete(options: AxiosRequestOptions): Promise<any>;
}

declare class CronManager {
    serviceName: string;
    logger: typeof logger;
    redis: any;
    persistent?: boolean;
    timezone?: string;
    persistService?: PersistService;
    mongoClient?: any;
    db?: any;
    redlock?: Redlock;
    jobs: Map<string, CronJobDefinition>;
    constructor({ serviceName, redis, persistent, timezone, persistService, mongoClient, }: CronManagerConstructorParams);
    generateUniqueId(): string;
    trackJobState(jobName: string, state: string): Promise<void>;
    getJobState(jobName: string): Promise<any>;
    saveJobDefinition(name: string, cronExpression: string, apiConfig: CronApiConfig, options?: JobOptions): Promise<void>;
    restoreJobsFromRedis(): Promise<void>;
    restoreJobsFromMongo(): Promise<void>;
    registerJob(name: string, cronExpression: string, apiConfig: CronApiConfig, options?: JobOptions): void;
    pauseJob(name: string): void;
    resumeJob(name: string): void;
    startJob(name: string): void;
    stopJob(name: string): void;
    removeJob(name: string): Promise<void>;
    listJobs(): string[];
}

declare class S3Service {
    private static s3;
    static init(config: S3Config): void;
    static uploadFile(params: UploadFileParams): Promise<PutObjectCommandOutput>;
    static getPresignedUrl(params: PresignedUrlParams): Promise<string>;
    static deleteFile(params: DeleteFileParams): Promise<DeleteObjectCommandOutput>;
}

type HolidayList = Date[];

type TimeUnit = "second" | "minute" | "hour" | "day" | "month" | "year";

interface CreateDateOptions {
    value: string | Date;
    format?: string;
    timezone?: string;
}
interface DateParts {
    year: number;
    month: number;
    day: number;
    hour?: number;
    minute?: number;
    second?: number;
    millisecond?: number;
    timezone?: string;
}

type DurationUnit = "milliseconds" | "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years";
interface DurationBreakdown {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

type DateInput = Date | string | number;

type DateAddSubtractUnit = "days" | "months" | "years" | "weeks" | "hours" | "minutes" | "seconds";
type DateSetUnit = "year" | "month" | "day" | "hour" | "minute" | "second";
type DateStartEndUnit = "day" | "month" | "week" | "year";

type DateRange = [Date, Date];
type ChunkUnit = "day" | "week" | "month";

interface HashParams {
    password: string;
    saltRounds?: number;
}
interface CompareParams {
    password: string;
    hashed: string;
}
interface EncryptParams {
    text: string;
    key?: string;
}
interface DecryptParams {
    encryptedText: string;
    key?: string;
}

interface I18nInitParams {
    config: Record<string, any>;
    locales: Record<string, any>;
}
interface I18nInterface {
    init(params: I18nInitParams): Promise<void>;
    getMessage(locale: string, key: string): string;
    getConfig(code: string): any;
}

type AnyObject = Record<string, any>;
type DebounceOptions = {
    leading?: boolean;
    maxWait?: number;
    trailing?: boolean;
};

interface ResponseUtilData {
    [key: string]: any;
}
interface ResponseUtilSend {
    (req: Request & {
        requestId?: string;
    }, res: Response & {
        locale?: string;
    }, code: string, data?: ResponseUtilData): any;
}

declare class DateUtilBusiness {
    static isBusinessDay(date: Date): boolean;
    static nextBusinessDay(date: Date): Date | null;
    static getNthWeekdayInMonth(n: number, weekday: number, month: number, year: number): Date | null;
    static isHoliday(date: Date, holidayList: HolidayList): boolean;
    static addBusinessDays(date: Date, n: number): Date | null;
}

declare class DateUtilCompare {
    static isBefore(date: Date, otherDate: Date, unit?: TimeUnit): boolean;
    static isAfter(date: Date, otherDate: Date, unit?: TimeUnit): boolean;
    static isSame(date: Date, otherDate: Date, unit?: TimeUnit): boolean;
    static compare(date: Date, otherDate: Date): number;
    static isBetween(date: Date, start: Date, end: Date): boolean;
}

declare class DateUtilCreate {
    static create({ value, format: dateFormat, timezone, }: CreateDateOptions): Date | null;
    static now(timezone?: string): Date;
    static fromUnix(unixTimestamp: number, timezone?: string): Date;
    static fromISOString(isoString: string, timezone?: string): Date;
    static fromParts({ year, month, day, hour, minute, second, millisecond, timezone, }: DateParts): Date;
}

declare class DateUtilDuration {
    static diff(date1: Date, date2: Date, unit: DurationUnit, float?: boolean): number | null;
    static duration(from: Date, to: Date): DurationBreakdown | null;
    static fromNow(date: Date): string | null;
    static countWeekdays(from: Date, to: Date): number | null;
}

declare class DateUtilEdgeCase {
    static handleInvalidFallback(date: DateInput, fallback: Date): Date | null;
    static normalizeDateInput(input: DateInput): Date | null;
    static getMaxDate(...dates: Date[]): Date | null;
    static getMinDate(...dates: Date[]): Date | null;
    static isAmbiguousDST(date: Date): boolean;
}

declare class DateUtilFormat {
    static formatDate(date: Date, formatStr: string): string;
    static toISOString(date: Date): string;
    static toUnix(date: Date): number;
    static toJSON(date: Date): string;
    static toLocaleString(date: Date, locale?: string, opts?: Intl.DateTimeFormatOptions): string;
    static getOffset(date: Date): string;
}

declare class DateUtilManipulate {
    static add(date: Date, value: number, unit: DateAddSubtractUnit): Date | null;
    static subtract(date: Date, value: number, unit: DateAddSubtractUnit): Date | null;
    static set(date: Date, unit: DateSetUnit, value: number): Date | null;
    static startOf(date: Date, unit: DateStartEndUnit): Date | null;
    static endOf(date: Date, unit: DateStartEndUnit): Date | null;
    static clone(date: Date): Date | null;
}

declare class DateUtilsRange {
    static getDateRange(start: Date, end: Date): Date[];
    static chunkBy(dateRange: Date[], unit: ChunkUnit): Date[][];
    static intersectRanges(r1: DateRange, r2: DateRange): boolean;
    static mergeRanges(ranges: DateRange[]): DateRange[];
}

declare class DateUtilTimezone {
    static convertToTZ(date: Date, timezone: string): Date | null;
    static getTimezone(): string | null;
    static withLocale(date: Date, locale: string): string | null;
    static getTimezoneAbbr(date: Date): string | null;
    static getTimezoneOffsetMinutes(date: Date): number | null;
}

declare class DateUtilValidate {
    static isValid(date: Date | string): boolean;
    static parseDate(str: string, formats?: string[]): Date | null;
    static isLeapYear(year: number): boolean;
    static isDST(date: Date): boolean;
    static isWeekend(date: Date): boolean;
    static isSameDay(date1: Date, date2: Date): boolean;
}

declare class ResponseUtil {
    static send: ResponseUtilSend;
}

declare const i18n: I18nInterface;

declare class LodashHelper {
    static get<T = any>(obj: AnyObject, path: string, defaultVal?: T): T;
    static set(obj: AnyObject, path: string, value: any): AnyObject;
    static merge(target: AnyObject, ...sources: AnyObject[]): AnyObject;
    static cloneDeep<T = any>(value: T): T;
    static isEmpty(value: any): boolean;
    static omit(obj: AnyObject, keys: string[]): AnyObject;
    static pick(obj: AnyObject, keys: string[]): AnyObject;
    static uniqBy<T = any>(array: T[], key: string): T[];
    static debounce<T extends (...args: any[]) => any>(func: T, wait: number, options?: DebounceOptions): DebouncedFunc<T>;
    static getOrDefault<T = any>(obj: AnyObject, path: string, defaultVal?: T): T;
    static hasNestedKeys(obj: AnyObject, paths?: string[]): boolean;
    static deepCloneAndSet(obj: AnyObject, path: string, value: any): AnyObject;
    static compactObject(obj: AnyObject): AnyObject;
}

declare class EncryptionUtil {
    static hash({ password, saltRounds, }: HashParams): Promise<string>;
    static compare({ password, hashed }: CompareParams): Promise<boolean>;
    static encrypt({ text, key, }: EncryptParams): string;
    static decrypt({ encryptedText, key, }: DecryptParams): string;
}

export { AsyncRouteWrapper, AuthMiddleware, AxiosHelper, BodyParser, CompressionHandler, Cors, CronManager, DateUtilBusiness, DateUtilCompare, DateUtilCreate, DateUtilDuration, DateUtilEdgeCase, DateUtilFormat, DateUtilManipulate, DateUtilTimezone, DateUtilValidate, DateUtilsRange, DotEnv, EncryptionUtil, ErrorHandler, ExpressPack, JWTUtil, LodashHelper, LoggerHandler, MongooseCorePlugin, MongoosePerformancePlugin, MongoosePopulatePlugin, MongooseSecurityPlugin, NodeMailerService, PassportService, RateLimitHandler, RequestTracer, RequestValidator, ResponseUtil, S3Service, SMSService, SecurityHandler, TokenBlacklistedError, TokenExpiredError, TokenInvalidError, availablePlugins, i18n, logger };
