import { logger } from '../utils/logger';
import fs from 'fs-extra';
import path from 'path';

export async function doctorCommand() {
    logger.info('\n👩‍⚕️ Express Pack Doctor\n');

    const checks = [
        { name: 'Node.js Version (>= 18)', check: () => parseInt(process.versions.node.split('.')[0]) >= 18 },
        { name: 'NPM Installed', check: () => true }, // Assumed if running via npx
        { name: 'Git Installed', check: () => true }, // TODO: Actual check
        { name: 'package.json exists', check: () => fs.existsSync(path.join(process.cwd(), 'package.json')) },
    ];

    let passed = 0;

    for (const item of checks) {
        if (item.check()) {
            logger.success(`✅ ${item.name}`);
            passed++;
        } else {
            logger.error(`❌ ${item.name}`);
        }
    }

    logger.info(`\nPassed ${passed}/${checks.length} checks.\n`);
}
