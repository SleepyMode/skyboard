
import * as path from 'path';
import {Router} from './lib/routing/router.js';
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

Router.getInstance().defineRoute('GET', '/', (ctx) => {
    console.log(ctx.arguments);
    ctx.setContent('<html lang="en"><body>Testing...</body></html>')
        .send();
});

Router.getInstance().defineRoute('GET', '/test/:test-:test2', (ctx) => {
    console.log(ctx.arguments);
    ctx.setContent('<html lang="en"><body>Testing with args...</body></html>')
        .send();
})

const app = App.getInstance();
app.initialize();