import { generateModule } from '../generators/module';
import { generateRoute } from '../generators/route';
import { generateService } from '../generators/service';
import { generateModel } from '../generators/model';
import { logger } from '../utils/logger';

export async function generateCommand(type: string, name: string) {
    try {
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
            case 'model':
                await generateModel(name);
                break;
            default:
                logger.error(`Unknown type: ${type}`);
                logger.info('Available types: module, route, service, model');
                process.exit(1);
        }
    } catch (error: any) {
        logger.error('Failed to generate code');
        logger.error(error.message);
        process.exit(1);
    }
}
