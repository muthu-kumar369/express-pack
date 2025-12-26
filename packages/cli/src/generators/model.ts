import fs from 'fs-extra';
import path from 'path';
import { logger } from '../utils/logger';

const toKebabCase = (str: string) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
const toPascalCase = (str: string) => str.replace(/(^\w|-\w)/g, (text) => text.replace(/-/, "").toUpperCase());

export async function generateModel(name: string) {
    const modelName = toKebabCase(name);
    const className = toPascalCase(name);

    const cwd = process.cwd();
    const filePath = path.join(cwd, `${modelName}.model.ts`);

    if (fs.existsSync(filePath)) {
        throw new Error(`Model ${modelName}.model.ts already exists`);
    }

    logger.info(`Creating model: ${modelName}.model.ts...`);

    const content = `import mongoose from 'mongoose';

export interface I${className} {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new mongoose.Schema<I${className}>({
  name: { type: String, required: true },
}, { timestamps: true });

export const ${className}Model = mongoose.model<I${className}>('${className}', schema);
`;

    await fs.writeFile(filePath, content);
    logger.success(`Model ${modelName}.model.ts created successfully!`);
}
