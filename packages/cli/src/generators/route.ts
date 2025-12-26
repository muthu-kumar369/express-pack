import fs from 'fs-extra';
import path from 'path';
import { logger } from '../utils/logger';

const toKebabCase = (str: string) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
const toPascalCase = (str: string) => str.replace(/(^\w|-\w)/g, (text) => text.replace(/-/, "").toUpperCase());

export async function generateRoute(name: string) {
    const routeName = toKebabCase(name);
    const className = toPascalCase(name);

    const cwd = process.cwd();
    const filePath = path.join(cwd, `${routeName}.router.ts`);

    if (fs.existsSync(filePath)) {
        throw new Error(`Router ${routeName}.router.ts already exists`);
    }

    logger.info(`Creating router: ${routeName}.router.ts...`);

    const content = `import { Router } from 'express';
import { AsyncRouteWrapper } from '@express-pack/core';

const router = Router();

router.get('/', AsyncRouteWrapper(async (req, res) => {
  res.json({ message: '${className} route working' });
}));

export const ${className}Router = router;
`;

    await fs.writeFile(filePath, content);
    logger.success(`Router ${routeName}.router.ts created successfully!`);
}
