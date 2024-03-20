import path from 'path';
import fs from 'fs';
import * as ejs from 'ejs';

export class Context {
    request;
    response;
    arguments;
    statusCode = 200;
    headers = {
        'Content-Type': 'text/html'
    };
    content;

    constructor(req, res, args) {
        this.request = req;
        this.response = res;
        this.arguments = args;
    }

    setStatusCode(code) {
        this.statusCode = code;
        return this;
    }

    setHeader(name, value) {
        this.headers[name] = value;
        return this;
    }

    setContent(content) {
        this.content = content;
        return this;
    }

    setView(viewName, data) {
        const file = path.join(globalThis.sbRoot, `/src/views/${viewName}.ejs`);
        console.log(file);

        try {
            fs.accessSync(file);
            this.content = ejs.render(fs.readFileSync(file, {encoding: 'utf-8'}), data || {}, {
                root: globalThis.sbRoot
            });
        } catch (e) {
            console.error(e);
            this.content = '<b>Invalid view path</b>';
        }

        return this;
    }

    send() {
        this.response.writeHead(this.statusCode, this.headers);
        this.response.end(this.content);
    }
}
