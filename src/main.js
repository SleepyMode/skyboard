
import * as path from 'path';
import * as http from 'http';
import {Router} from './lib/routing/router.js';
import * as fs from 'fs/promises';
import * as security from "./lib/security.js";

security.init();

eval('');

const cwd = process.cwd();
if (await fs.access(path.join(cwd, '.cwdhelper'))) {
    globalThis.sbRoot = path.join(process.cwd(), '../');
} else {
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

const server = http.createServer((req, res) => {
    console.log('----- new request ------');
    console.log('method', req.method);
    console.log('url', req.url);
    console.log('----- end request ------');

    const [route, match] = Router.getInstance().parse(req);
    if (route == null) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<html lang="en"><body>Not found.</body></html>');
        return;
    }

    route.handler(match.params, req, res);
}).listen(3123);