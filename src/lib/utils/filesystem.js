import * as path from 'path';
import * as fs from 'fs/promises';

const workingDirectory = globalThis.sbRoot;

export async function canAccess(filePath) {
    try {
        await fs.access(path.join(workingDirectory, filePath));
        return true;
    } catch {
        return false;
    }
}
