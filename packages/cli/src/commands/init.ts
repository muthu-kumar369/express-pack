import inquirer from 'inquirer';
import ora from 'ora';
import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';
import { logger } from '../utils/logger.js';

export async function initCommand(projectName: string, options: any) {
    logger.info(`\n🚀 Creating express-pack project: ${projectName}\n`);

    // Prompt for configuration
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'template',
            message: 'Select project template:',
            choices: ['rest-api', 'multitenant', 'microservice'],
            default: options.template,
        },
        {
            type: 'checkbox',
            name: 'features',
            message: 'Select features:',
            choices: [
                { name: 'Authentication (JWT)', value: 'auth', checked: true },
                { name: 'Database (MongoDB)', value: 'db', checked: true },
                { name: 'Caching (Redis)', value: 'cache' },
                { name: 'Queue (RabbitMQ)', value: 'queue' },
                { name: 'Email', value: 'email' },
                { name: 'File Storage (S3)', value: 'storage' },
                { name: 'Payment (Stripe)', value: 'payment' },
            ],
        },
        {
            type: 'confirm',
            name: 'typescript',
            message: 'Use TypeScript?',
            default: true,
        },
    ]);

    // Create project
    const spinner = ora('Creating project...').start();

    try {
        const projectPath = path.resolve(process.cwd(), projectName);

        if (fs.existsSync(projectPath)) {
            spinner.fail('Directory already exists');
            process.exit(1);
        }

        // Create directory
        await fs.mkdir(projectPath);

        // Generate package.json
        await generatePackageJson(projectPath, projectName, answers);

        // Generate project structure
        await generateProjectStructure(projectPath, answers);

        // Install dependencies
        spinner.text = 'Installing dependencies...';
        // We use npm install inside the new project directory
        await execa('npm', ['install'], { cwd: projectPath });

        spinner.succeed('Project created successfully!');

        // Show next steps
        logger.info('\n📋 Next steps:\n');
        logger.info(`  cd ${projectName}`);
        logger.info('  npm run dev');
        console.log('\n');
    } catch (error) {
        spinner.fail('Failed to create project');
        console.error(error);
        process.exit(1);
    }
}

async function generatePackageJson(projectPath: string, name: string, config: any) {
    const dependencies: Record<string, string> = {
        '@express-pack/core': '^2.0.0',
        'express': '^4.18.2',
        'dotenv': '^16.4.1',
        'helmet': '^7.1.0',
        'cors': '^2.8.5',
    };

    if (config.features.includes('auth')) dependencies['@express-pack/auth'] = '^2.0.0';
    if (config.features.includes('db')) dependencies['@express-pack/db'] = '^2.0.0';
    if (config.features.includes('cache')) dependencies['@express-pack/cache'] = '^2.0.0';
    if (config.features.includes('queue')) dependencies['@express-pack/queue'] = '^2.0.0';
    if (config.features.includes('email')) dependencies['@express-pack/email'] = '^2.0.0';
    if (config.features.includes('storage')) dependencies['@express-pack/storage'] = '^2.0.0';
    if (config.features.includes('payment')) dependencies['@express-pack/payment'] = '^2.0.0';

    const pkg = {
        name,
        version: '1.0.0',
        type: 'module',
        scripts: {
            dev: 'tsx watch src/app.ts',
            build: 'tsc',
            start: 'node dist/app.js',
        },
        dependencies,
        devDependencies: config.typescript ? {
            'typescript': '^5.3.3',
            'tsx': '^4.7.0',
            '@types/express': '^4.17.21',
            '@types/node': '^20.11.16',
            '@types/cors': '^2.8.17',
        } : {},
    };

    await fs.writeJSON(path.join(projectPath, 'package.json'), pkg, { spaces: 2 });
}

async function generateProjectStructure(projectPath: string, config: any) {
    // Create src directory
    await fs.ensureDir(path.join(projectPath, 'src'));

    // Create app.ts
    const appContent = `import { ExpressPack } from '@express-pack/core';
import express from 'express';

const app = express();

ExpressPack.init({
  app,
  config: {
    cors: { origin: '*' },
  },
});

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ${path.basename(projectPath)}!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
`;
    await fs.writeFile(path.join(projectPath, 'src/app.ts'), appContent);

    // Create tsconfig.json if TypeScript
    if (config.typescript) {
        const tsconfig = {
            compilerOptions: {
                target: 'ES2020',
                module: 'NodeNext',
                moduleResolution: 'NodeNext',
                outDir: './dist',
                rootDir: './src',
                strict: true,
                esModuleInterop: true,
            },
            include: ['src/**/*'],
        };
        await fs.writeJSON(path.join(projectPath, 'tsconfig.json'), tsconfig, { spaces: 2 });
    }

    // Create config directory
    await fs.ensureDir(path.join(projectPath, 'src/config'));
}
