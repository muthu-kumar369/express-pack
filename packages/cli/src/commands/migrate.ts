import { logger } from '../utils/logger';
import * as fs from 'fs-extra';
import * as path from 'path';
import inquirer from 'inquirer';



export async function migrateCommand(options: { v2?: boolean } = {}) {
    logger.info('\n🔄 Express-Pack Migration Tool\n');

    if (options.v2) {
        await runV2Migration();
        return;
    }

    // Interactive selection if no flag provided
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What migration would you like to run?',
            choices: [
                { name: 'Migrate v1 to v2 (Update Imports)', value: 'v2' },
                { name: 'Database Migration (Coming Soon)', value: 'db', disabled: 'Requires @express-pack/db setup' },
                { name: 'Cancel', value: 'cancel' }
            ]
        }
    ]);

    if (action === 'v2') {
        await runV2Migration();
    } else {
        logger.info('Operation cancelled.');
    }
}

async function runV2Migration() {
    logger.info('🚀 Starting v1 to v2 Migration Codemod...');

    const rootDir = process.cwd();
    logger.info(`Scanning directory: ${rootDir}`);

    const mapping: Record<string, string> = {
        'ExpressPack': '@express-pack/core',
        'AsyncRouteWrapper': '@express-pack/core',
        'MiddlewareConfig': '@express-pack/core',
        'RouteGroup': '@express-pack/core',
        'ErrorHandler': '@express-pack/core',
        'JWTUtil': '@express-pack/auth',
        'AuthMiddleware': '@express-pack/auth',
        'RequestValidator': '@express-pack/validation',
        'validate': '@express-pack/validation',
        'RedisClientService': '@express-pack/cache',
        'RabbitMQService': '@express-pack/queue',
        'CronManager': '@express-pack/scheduler',
        'EmailService': '@express-pack/email',
        'S3StorageService': '@express-pack/storage',
        'StripeService': '@express-pack/payment',
        'TimestampPlugin': '@express-pack/db',
        'SoftDeletePlugin': '@express-pack/db',
        'EncryptionUtil': '@express-pack/utils',
        'ResponseUtil': '@express-pack/utils',
    };

    let modifiedCount = 0;

    async function processFile(filePath: string) {
        let content = await fs.readFile(filePath, 'utf8');
        let hasChanges = false;

        const importRegex = /import\s+{([^}]+)}\s+from\s+['"]express-pack['"];/g;

        content = content.replace(importRegex, (match: string, imports: string) => {
            hasChanges = true;
            const items = imports.split(',').map((s: string) => s.trim());
            const newImports: Record<string, string[]> = {};

            items.forEach((item: string) => {
                const name = item.split(/\s+as\s+/)[0];
                const pkg = mapping[name] || 'express-pack';

                if (!newImports[pkg]) newImports[pkg] = [];
                newImports[pkg].push(item);
            });

            return Object.entries(newImports)
                .map(([pkg, items]) => `import { ${items.join(', ')} } from '${pkg}';`)
                .join('\n');
        });

        if (hasChanges) {
            await fs.writeFile(filePath, content);
            logger.success(`Updated imports in: ${path.relative(rootDir, filePath)}`);
            modifiedCount++;
        }
    }

    async function walk(dir: string) {
        const files = await fs.readdir(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            if (file === 'node_modules' || file === 'dist' || file === '.git') continue;

            const stat = await fs.stat(filePath);
            if (stat.isDirectory()) {
                await walk(filePath);
            } else if (file.endsWith('.ts') || file.endsWith('.js')) {
                await processFile(filePath);
            }
        }
    }

    await walk(rootDir);

    if (modifiedCount > 0) {
        logger.success(`\n✅ Migration complete! Updated ${modifiedCount} files.`);
        logger.info('Please run "npm install" to ensure new scoped packages are installed.');
    } else {
        logger.info('\n⚠️ No files needed updating. You might already be on v2 or not using "express-pack" imports.');
    }
}

