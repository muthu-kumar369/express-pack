/**
 * CLI Entry Point
 */
import { Command } from 'commander';
import { initCommand } from './commands/init';
import { generateCommand } from './commands/generate';

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

import { infoCommand } from './commands/info';
import { doctorCommand } from './commands/doctor';
import { migrateCommand } from './commands/migrate';

// ... existing code ...

program
    .command('info')
    .description('Show project information')
    .action(infoCommand);

program
    .command('doctor')
    .description('Check project health')
    .action(doctorCommand);

program
    .command('migrate')
    .description('Run migration tools')
    .option('--v2', 'Run v1 to v2 migration codemod')
    .action((options) => migrateCommand(options));


program.parse();
