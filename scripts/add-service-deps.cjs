const fs = require('fs');
const path = require('path');

const packageConfigs = {
  cache: {
    dependencies: {
      'ioredis': '^5.4.1',
      'redlock': '^5.0.0-beta.2'
    },
    devDependencies: {
      '@types/ioredis': '^5.0.0'
    }
  },
  queue: {
    dependencies: {
      'amqplib': '^0.10.5'
    },
    devDependencies: {
      '@types/amqplib': '^0.10.5'
    }
  },
  storage: {
    dependencies: {
      '@aws-sdk/client-s3': '^3.709.0',
      '@aws-sdk/s3-request-presigner': '^3.709.0'
    }
  },
  payment: {
    dependencies: {
      'stripe': '^17.5.0'
    }
  },
  db: {
    dependencies: {
      'mongoose': '^8.9.3'
    }
  },
  email: {
    dependencies: {
      '@sendgrid/mail': '^8.1.4',
      '@aws-sdk/client-ses': '^3.709.0',
      'nodemailer': '^6.9.16',
      'mailgun.js': '^10.2.3'
    },
    devDependencies: {
      '@types/nodemailer': '^6.4.17'
    }
  },
  scheduler: {
    dependencies: {
      '@express-pack/cache': '^2.0.0',
      'node-cron': '^3.0.3'
    }
  }
};

const packagesDir = path.join(__dirname, '../packages');

Object.entries(packageConfigs).forEach(([pkgName, config]) => {
  const pkgJsonPath = path.join(packagesDir, pkgName, 'package.json');
  
  if (fs.existsSync(pkgJsonPath)) {
    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
    
    // Add dependencies
    if (config.dependencies) {
      pkgJson.dependencies = { ...pkgJson.dependencies, ...config.dependencies };
    }
    
    // Add devDependencies
    if (config.devDependencies) {
      pkgJson.devDependencies = { ...pkgJson.devDependencies, ...config.devDependencies };
    }
    
    fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + '\n');
    console.log(`Updated ${pkgName} package.json`);
  }
});
