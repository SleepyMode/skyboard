import {Route} from './route.js';

export class Router {
    static #instance = null;

    static getInstance() {
        if (this.#instance == null) {
            this.#instance = new Router();
        }

        return this.#instance;
    }

    routes = {};

    defineRoute(method, path, handler) {
        this.routes[path] = new Route(method, path, handler);
    }

    deleteRoute(path) {
        this.routes[path] = null;
    }

    getRoute(path) {
        return this.routes[path];
    }

    parse(req) {
        let targetRoute = null;
        let matchValue = null;

        for (const [_, route] of Object.entries(this.routes)) {
            if (req.method !== route.method) {
                continue;
            }

            matchValue = route.match(req.url);
            if (matchValue) {
                targetRoute = route;
                break;
            }
        }

        return [targetRoute, matchValue];
    }
}
