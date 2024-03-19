
import * as path from 'path';
import * as fs from 'fs/promises';
import * as security from './lib/security.js';
import {App} from './core/app.js';

security.init();

const cwd = process.cwd();
try {
    await fs.access(path.join(cwd, '.cwdhelper'));
    globalThis.sbRoot = path.join(process.cwd(), '../');
} catch {
    globalThis.sbRoot = process.cwd();
}

const app = App.getInstance();
app.initialize();