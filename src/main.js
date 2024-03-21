
import * as path from 'path';
import * as fs from 'fs/promises';
import {App} from './core/app.js';

const cwd = process.cwd();
try {
    await fs.access(path.join(cwd, '.cwdhelper'));
    globalThis.sbRoot = cwd;
} catch {
    if (process.env.SB_ROOT) {
        globalThis.sbRoot = process.env.SB_ROOT
    } else {
        console.error('Failed to find SkyBoard\'s root. Set the SB_ROOT environment variable manually.');
        process.exit(100);
    }
}

const app = App.getInstance();
app.initialize();