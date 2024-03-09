import {match} from 'path-to-regexp';

export class Route {
    method;
    path;
    handler;
    #matchFn;

    constructor(method, path, handler) {
        this.method = method;
        this.path = path;
        this.handler = handler;
        this.#matchFn = match(path);
    }

    match(url) {
        return this.#matchFn(url);
    }
}
