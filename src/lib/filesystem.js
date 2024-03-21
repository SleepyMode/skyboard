
import * as path from 'path';
import fsp from 'fs/promises';
import fs from 'fs';

export async function fileExists(filePath) {
    try {
        await fsp.access(path.join(globalThis.sbRoot, filePath));
        return true;
    } catch {
        return false;
    }
}

export async function readFile(filePath) {
    if (!await fileExists(filePath)) {
        return null;
    }
    return await fsp.readFile(path.join(globalThis.sbRoot, filePath), {
        encoding: 'utf-8'
    });
}

export async function copyFile(filePath, newPath) {
    if (!await fileExists(filePath) || await fileExists(newPath)) {
        return false;
    }

    await fsp.copyFile(path.join(globalThis.sbRoot, filePath),
        path.join(globalThis.sbRoot, newPath));
    return true;
}

export async function readDir(dirPath, options) {
    // Just a straight redirect, so we don't have to import both
    // our own version of the filesystem and Node.js' native
    // edition.
    return await fsp.readdir(dirPath, options);
}

export function fileExistsSync(filePath) {
    try {
        fs.accessSync(path.join(globalThis.sbRoot, filePath));
        return true;
    } catch {
        return false;
    }
}

export function readFileSync(filePath) {
    if (!fileExistsSync(filePath)) {
        return null;
    }

    return fs.readFileSync(path.join(globalThis.sbRoot, filePath), {
        encoding: 'utf-8'
    });
}

export function copyFileSync(filePath, newPath) {
    if (!fileExistsSync(filePath) || fileExistsSync(newPath)) {
        return false;
    }

    fs.copyFileSync(path.join(globalThis.sbRoot, filePath),
        path.join(globalThis.sbRoot, newPath));
    return true;
}
