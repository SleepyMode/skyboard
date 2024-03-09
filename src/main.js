
import * as path from 'path';
import {Router} from './lib/routing/router.js';
import * as fs from 'fs/promises';
import * as security from './lib/security.js';
import {App} from './core/app.js';

security.init();

const cwd = process.cwd();
try {
    await fs.access(path.join(cwd, '.cwdhelper'))
    globalThis.sbRoot = path.join(process.cwd(), '../');
} catch {
    globalThis.sbRoot = process.cwd();
}

Router.getInstance().defineRoute('GET', '/', (args, req, res) => {
    console.log(args);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<html lang="en"><body>Testing...</body></html>');
});

Router.getInstance().defineRoute('GET', '/test/:test-:test2', (args, req, res) => {
    console.log(args);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<html lang="en"><body>Testing with args...</body></html>');
})

const app = App.getInstance();
app.initialize();