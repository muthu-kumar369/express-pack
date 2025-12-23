# Task 3: CLI Framework Development

## Context

express-pack needs a CLI tool to improve developer experience through project scaffolding, code generation, and automation tasks.

## Objective

Create @express-pack/cli with commands for project initialization, module generation, and development utilities.

---

## CLI Commands

### 1. Project Initialization
```bash
npx @express-pack/cli init <project-name> [options]
```

### 2. Module Generation
```bash
npx @express-pack/cli generate module <name>
npx @express-pack/cli generate route <name>
npx @express-pack/cli generate service <name>
npx @express-pack/cli generate model <name>
```

### 3. Utilities
```bash
npx @express-pack/cli migrate        # Run migrations
npx @express-pack/cli info           # Show project info
npx @express-pack/cli doctor         # Check project health
```

---

## Implementation

### 1. Setup CLI Framework

**Install Dependencies:**
```bash
cd packages/cli
npm install commander inquirer chalk ora
npm install --save-dev @types/inquirer
```

**packages/cli/src/index.ts:**
```typescript
#!/usr/bin/env node
import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { generateCommand } from './commands/generate.js';

const program = new Command();

program
  .name('@express-pack/cli')
  .description('CLI tool for express-pack')
  .version('2.0.0');

program
  .command('init <project-name>')
  .description('Initialize a new express-pack project')
  .option('-t, --template <template>', 'Project template', 'rest-api')
  .action(initCommand);

program
  .command('generate <type> <name>')
  .alias('g')
  .description('Generate code (module, route, service, model)')
  .action(generateCommand);

program.parse();
```

### 2. Init Command

**packages/cli/src/commands/init.ts:**
```typescript
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export async function initCommand(projectName: string, options: any) {
  console.log(chalk.blue(`\n🚀 Creating express-pack project: ${projectName}\n`));

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
    // Create directory
    fs.mkdirSync(projectName);
    process.chdir(projectName);

    // Generate package.json
    generatePackageJson(projectName, answers);

    // Generate project structure
    generateProjectStructure(answers);

    // Install dependencies
    spinner.text = 'Installing dependencies...';
    execSync('npm install', { stdio: 'inherit' });

    spinner.succeed(chalk.green('Project created successfully!'));

    // Show next steps
    console.log(chalk.blue('\n📋 Next steps:\n'));
    console.log(`  cd ${projectName}`);
    console.log('  npm run dev');
    console.log('\n');
  } catch (error) {
    spinner.fail(chalk.red('Failed to create project'));
    console.error(error);
    process.exit(1);
  }
}

function generatePackageJson(name: string, config: any) {
  const dependencies: any = {
    '@express-pack/core': '^2.0.0',
    'express': '^4.0.0',
  };

  if (config.features.includes('auth')) dependencies['@express-pack/auth'] = '^2.0.0';
  if (config.features.includes('db')) dependencies['@express-pack/db'] = '^2.0.0';
  if (config.features.includes('cache')) dependencies['@express-pack/cache'] = '^2.0.0';
  // ... more features

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
      'typescript': '^5.8.3',
      'tsx': '^4.0.0',
      '@types/express': '^5.0.2',
    } : {},
  };

  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
}
```

### 3. Generate Command

**packages/cli/src/commands/generate.ts:**
```typescript
import { generateModule } from '../generators/module.js';
import { generateRoute } from '../generators/route.js';
import { generateService } from '../generators/service.js';

export async function generateCommand(type: string, name: string) {
  switch (type) {
    case 'module':
      await generateModule(name);
      break;
    case 'route':
      await generateRoute(name);
      break;
    case 'service':
      await generateService(name);
      break;
    default:
      console.error(`Unknown type: ${type}`);
      process.exit(1);
  }
}
```

---

## Verification

```bash
# Test CLI
npx @express-pack/cli init test-project
cd test-project
npm run dev
```

---

## Estimated Effort

- **Time:** 2 days
- **Complexity:** Medium
- **Risk:** Low
