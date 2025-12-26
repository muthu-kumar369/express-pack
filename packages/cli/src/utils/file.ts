import fs from 'fs-extra';
import path from 'path';

export const createFile = async (filePath: string, content: string) => {
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content);
};

export const createDir = async (dirPath: string) => {
    await fs.ensureDir(dirPath);
};

export const copyTemplate = async (src: string, dest: string) => {
    await fs.copy(src, dest);
};
