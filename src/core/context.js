
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

    send() {
        this.response.writeHead(this.statusCode, this.headers);
        this.response.end(this.content);
    }
}
