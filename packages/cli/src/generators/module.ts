// import { Utils } from '@express-pack/utils';
import fs from 'fs-extra';
import path from 'path';
import { logger } from '../utils/logger';

// Helper for casing since we can't easily rely on external utils inside CLI yet without linking issues
// replicating basic utils here for CLI independence
const toKebabCase = (str: string) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
const toPascalCase = (str: string) => str.replace(/(^\w|-\w)/g, clearAndUpper);
const clearAndUpper = (text: string) => text.replace(/-/, "").toUpperCase();

export async function generateModule(name: string) {
    const moduleName = toKebabCase(name);
    const className = toPascalCase(name);

    const modulePath = path.join(process.cwd(), 'src', 'modules', moduleName);

    if (fs.existsSync(modulePath)) {
        throw new Error(`Module ${moduleName} already exists`);
    }

    logger.info(`Creating module: ${moduleName}...`);

    await fs.ensureDir(modulePath);
    await fs.ensureDir(path.join(modulePath, 'controller'));
    await fs.ensureDir(path.join(modulePath, 'service'));
    await fs.ensureDir(path.join(modulePath, 'model'));
    await fs.ensureDir(path.join(modulePath, 'router'));

    // Controller
    const controllerContent = `import { Request, Response } from 'express';
import { ${className}Service } from '../service/${moduleName}.service';

export class ${className}Controller {
  static async getAll(req: Request, res: Response) {
    const items = await ${className}Service.findAll();
    res.json({ data: items });
  }

  static async create(req: Request, res: Response) {
    const item = await ${className}Service.create(req.body);
    res.status(201).json({ data: item });
  }
}
`;
    await fs.writeFile(path.join(modulePath, 'controller', `${moduleName}.controller.ts`), controllerContent);

    // Service
    const serviceContent = `import { ${className}Model } from '../model/${moduleName}.model';

export class ${className}Service {
  static async findAll() {
    return ${className}Model.find();
  }

  static async create(data: any) {
    return ${className}Model.create(data);
  }
}
`;
    await fs.writeFile(path.join(modulePath, 'service', `${moduleName}.service.ts`), serviceContent);

    // Model
    const modelContent = `import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const ${className}Model = mongoose.model('${className}', schema);
`;
    await fs.writeFile(path.join(modulePath, 'model', `${moduleName}.model.ts`), modelContent);

    // Router
    const routerContent = `import { Router } from 'express';
import { ${className}Controller } from '../controller/${moduleName}.controller';
import { AsyncRouteWrapper } from '@express-pack/core';

const router = Router();

router.get('/', AsyncRouteWrapper(${className}Controller.getAll));
router.post('/', AsyncRouteWrapper(${className}Controller.create));

export const ${className}Router = router;
`;
    await fs.writeFile(path.join(modulePath, 'router', `${moduleName}.router.ts`), routerContent);

    logger.success(`Module ${moduleName} created successfully!`);
}
