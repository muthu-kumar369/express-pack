import fs from 'fs-extra';
import path from 'path';
import { logger } from '../utils/logger';

const toKebabCase = (str: string) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
const toPascalCase = (str: string) => str.replace(/(^\w|-\w)/g, (text) => text.replace(/-/, "").toUpperCase());

export async function generateService(name: string) {
    const serviceName = toKebabCase(name);
    const className = toPascalCase(name);

    // Try to find where we are
    const cwd = process.cwd();
    let targetDir = path.join(cwd, 'src', 'services');

    // If inside a module, put it there
    if (cwd.includes('modules')) {
        targetDir = cwd; // Current dir
    } else if (!fs.existsSync(targetDir)) {
        // If global services dir doesn't exist, use current dir
        targetDir = cwd;
    }

    const fileName = `${serviceName}.service.ts`;
    const filePath = path.join(targetDir, fileName);

    if (fs.existsSync(filePath)) {
        throw new Error(`Service ${fileName} already exists`);
    }

    logger.info(`Creating service: ${fileName}...`);

    const content = `export class ${className}Service {
  static async findAll() {
    // TODO: Implement
    return [];
  }

  static async findById(id: string) {
    // TODO: Implement
    return null;
  }

  static async create(data: any) {
    // TODO: Implement
    return data;
  }

  static async update(id: string, data: any) {
    // TODO: Implement
    return data;
  }

  static async delete(id: string) {
    // TODO: Implement
    return true;
  }
}
`;

    await fs.writeFile(filePath, content);
    logger.success(`Service ${fileName} created successfully!`);
}
