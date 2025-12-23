# Task 2: Unified Full-Stack CLI

## Context

Currently, express-pack and react-pack would have separate CLIs. A unified CLI is needed for seamless full-stack development.

## Objective

Create @fullstack-pack/cli that can scaffold full-stack projects, generate features across backend and frontend, and orchestrate development workflows.

---

## CLI Commands

### 1. Project Initialization
```bash
npx @fullstack-pack/cli init <project-name> [options]
  --template <template>    # monorepo, rest-api, saas, microservices
  --backend <backend>      # express-pack (default)
  --frontend <frontend>    # react-pack (default)
  --database <db>          # mongodb, postgresql, mysql
  --features <features>    # auth,cache,queue,email,storage
```

### 2. Feature Generation
```bash
# Generate full-stack feature (backend + frontend)
npx @fullstack-pack/cli generate feature <name>

# Generate backend module
npx @fullstack-pack/cli generate:backend module <name>

# Generate frontend page
npx @fullstack-pack/cli generate:frontend page <name>
```

### 3. Type Synchronization
```bash
# Sync types from backend to frontend
npx @fullstack-pack/cli sync-types

# Watch for changes and auto-sync
npx @fullstack-pack/cli sync-types --watch
```

### 4. Development
```bash
# Start both backend and frontend
npx @fullstack-pack/cli dev

# Start only backend
npx @fullstack-pack/cli dev:backend

# Start only frontend
npx @fullstack-pack/cli dev:frontend
```

### 5. Build & Deploy
```bash
# Build both
npx @fullstack-pack/cli build

# Deploy to platform
npx @fullstack-pack/cli deploy --platform vercel
```

---

## Implementation

### 1. CLI Framework

**packages/fullstack-cli/src/index.ts:**
```typescript
#!/usr/bin/env node
import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { generateCommand } from './commands/generate.js';
import { syncTypesCommand } from './commands/sync-types.js';
import { devCommand } from './commands/dev.js';

const program = new Command();

program
  .name('@fullstack-pack/cli')
  .description('Full-stack CLI for express-pack and react-pack')
  .version('1.0.0');

program
  .command('init <project-name>')
  .description('Initialize a new full-stack project')
  .option('-t, --template <template>', 'Project template', 'monorepo')
  .option('--backend <backend>', 'Backend framework', 'express-pack')
  .option('--frontend <frontend>', 'Frontend framework', 'react-pack')
  .action(initCommand);

program
  .command('generate <type> <name>')
  .alias('g')
  .description('Generate full-stack feature')
  .action(generateCommand);

program
  .command('sync-types')
  .description('Synchronize types from backend to frontend')
  .option('-w, --watch', 'Watch for changes')
  .action(syncTypesCommand);

program
  .command('dev')
  .description('Start development servers')
  .option('--backend-only', 'Start only backend')
  .option('--frontend-only', 'Start only frontend')
  .action(devCommand);

program.parse();
```

### 2. Init Command

**packages/fullstack-cli/src/commands/init.ts:**
```typescript
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { execSync } from 'child_process';

export async function initCommand(projectName: string, options: any) {
  console.log(chalk.blue(`\n🚀 Creating full-stack project: ${projectName}\n`));

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: 'Select project template:',
      choices: ['monorepo', 'rest-api', 'saas', 'microservices'],
      default: options.template,
    },
    {
      type: 'checkbox',
      name: 'features',
      message: 'Select features:',
      choices: [
        { name: 'Authentication', value: 'auth', checked: true },
        { name: 'Database (MongoDB)', value: 'db', checked: true },
        { name: 'Caching (Redis)', value: 'cache' },
        { name: 'Queue (RabbitMQ)', value: 'queue' },
        { name: 'Email', value: 'email' },
        { name: 'File Storage', value: 'storage' },
        { name: 'GraphQL', value: 'graphql' },
        { name: 'WebSocket', value: 'websocket' },
      ],
    },
  ]);

  const spinner = ora('Creating project structure...').start();

  try {
    // Create monorepo structure
    createMonorepoStructure(projectName, answers);

    // Generate backend
    spinner.text = 'Setting up backend...';
    await generateBackend(projectName, answers);

    // Generate frontend
    spinner.text = 'Setting up frontend...';
    await generateFrontend(projectName, answers);

    // Setup shared packages
    spinner.text = 'Setting up shared packages...';
    await setupSharedPackages(projectName);

    // Install dependencies
    spinner.text = 'Installing dependencies...';
    execSync('npm install', { cwd: projectName, stdio: 'inherit' });

    spinner.succeed(chalk.green('Project created successfully!'));

    console.log(chalk.blue('\n📋 Next steps:\n'));
    console.log(`  cd ${projectName}`);
    console.log('  npx @fullstack-pack/cli dev');
    console.log('\n');
  } catch (error) {
    spinner.fail(chalk.red('Failed to create project'));
    console.error(error);
    process.exit(1);
  }
}

function createMonorepoStructure(name: string, config: any) {
  const fs = require('fs');
  const path = require('path');

  // Create directory structure
  const dirs = [
    `${name}/apps/backend`,
    `${name}/apps/frontend`,
    `${name}/packages/shared-types`,
    `${name}/packages/shared-schemas`,
    `${name}/packages/shared-utils`,
  ];

  dirs.forEach(dir => fs.mkdirSync(dir, { recursive: true }));

  // Create root package.json
  const rootPackage = {
    name: name,
    private: true,
    workspaces: ['apps/*', 'packages/*'],
    scripts: {
      dev: '@fullstack-pack/cli dev',
      build: '@fullstack-pack/cli build',
      'sync-types': '@fullstack-pack/cli sync-types',
    },
  };

  fs.writeFileSync(
    path.join(name, 'package.json'),
    JSON.stringify(rootPackage, null, 2)
  );

  // Create lerna.json
  const lernaConfig = {
    version: 'independent',
    npmClient: 'npm',
    useWorkspaces: true,
    packages: ['apps/*', 'packages/*'],
  };

  fs.writeFileSync(
    path.join(name, 'lerna.json'),
    JSON.stringify(lernaConfig, null, 2)
  );
}
```

### 3. Type Synchronization

**packages/fullstack-cli/src/commands/sync-types.ts:**
```typescript
import { watch } from 'chokidar';
import { execSync } from 'child_process';
import chalk from 'chalk';

export async function syncTypesCommand(options: any) {
  console.log(chalk.blue('🔄 Synchronizing types...\n'));

  const syncTypes = () => {
    try {
      // Generate OpenAPI spec from backend
      execSync('npm run generate:openapi', {
        cwd: 'apps/backend',
        stdio: 'inherit',
      });

      // Generate TypeScript types from OpenAPI
      execSync('npx openapi-typescript ../backend/openapi.json -o src/types/api.ts', {
        cwd: 'apps/frontend',
        stdio: 'inherit',
      });

      console.log(chalk.green('✓ Types synchronized successfully\n'));
    } catch (error) {
      console.error(chalk.red('✗ Type synchronization failed\n'));
      console.error(error);
    }
  };

  // Initial sync
  syncTypes();

  // Watch mode
  if (options.watch) {
    console.log(chalk.blue('👀 Watching for changes...\n'));

    const watcher = watch('apps/backend/src/**/*.ts', {
      ignored: /node_modules/,
      persistent: true,
    });

    watcher.on('change', (path) => {
      console.log(chalk.yellow(`File changed: ${path}`));
      syncTypes();
    });
  }
}
```

### 4. Development Command

**packages/fullstack-cli/src/commands/dev.ts:**
```typescript
import concurrently from 'concurrently';
import chalk from 'chalk';

export async function devCommand(options: any) {
  const commands = [];

  if (!options.frontendOnly) {
    commands.push({
      command: 'npm run dev',
      name: 'backend',
      cwd: 'apps/backend',
      prefixColor: 'blue',
    });
  }

  if (!options.backendOnly) {
    commands.push({
      command: 'npm run dev',
      name: 'frontend',
      cwd: 'apps/frontend',
      prefixColor: 'magenta',
    });
  }

  console.log(chalk.blue('🚀 Starting development servers...\n'));

  const { result } = concurrently(commands, {
    prefix: 'name',
    killOthers: ['failure', 'success'],
    restartTries: 3,
  });

  try {
    await result;
  } catch (error) {
    console.error(chalk.red('Development servers failed'));
    process.exit(1);
  }
}
```

---

## Implementation Steps

1. **Create CLI Package**
   ```bash
   mkdir -p packages/fullstack-cli/src/commands
   ```

2. **Install Dependencies**
   ```bash
   npm install commander inquirer chalk ora concurrently chokidar
   ```

3. **Implement Commands**
   - Init command
   - Generate command
   - Sync types command
   - Dev command

4. **Create Templates**
   - Monorepo template
   - REST API template
   - SaaS template

5. **Test CLI**
   ```bash
   npx @fullstack-pack/cli init test-project
   ```

---

## Estimated Effort

- **Time:** 3 days
- **Complexity:** High
- **Risk:** Medium
