
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
    const fixedPath = path.join(globalThis.sbRoot, filePath);

    if (!(await fileExists(fixedPath))) {
        return null;
    }

    return await fsp.readFile(fixedPath, {
        encoding: 'utf-8'
    });
}

export async function copyFile(filePath, newPath) {
    const oldFilePath = path.join(globalThis.sbRoot, filePath);
    const newFilePath = path.join(globalThis.sbRoot, newPath);

    if (!(await fileExists(oldFilePath)) || await fileExists(newFilePath)) {
        return false;
    }

    await fsp.copyFile(oldFilePath, newFilePath);
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
    const fixedPath = path.join(globalThis.sbRoot, filePath);

    if (!fileExistsSync(filePath)) {
        return null;
    }

    return fs.readFileSync(fixedPath, {
        encoding: 'utf-8'
    });
}

export function copyFileSync(filePath, newPath) {
    const oldFilePath = path.join(globalThis.sbRoot, filePath);
    const newFilePath = path.join(globalThis.sbRoot, newPath);

    if (!fileExistsSync(oldFilePath) || fileExistsSync(newFilePath)) {
        return false;
    }

    fs.copyFileSync(oldFilePath, newFilePath);
    return true;
}
