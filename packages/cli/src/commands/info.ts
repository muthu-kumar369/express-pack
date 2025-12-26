import { logger } from '../utils/logger';

export async function infoCommand() {
    logger.info('\n📦 @express-pack/cli info\n');

    logger.info(`CLI Version:       2.0.0`);
    logger.info(`Node Version:      ${process.version}`);
    logger.info(`OS Platform:       ${process.platform}`);
    logger.info(`Working Directory: ${process.cwd()}\n`);

    // TODO: Check if inside an express-pack project and show local versions
}
