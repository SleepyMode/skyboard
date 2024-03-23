import {Router} from '../../lib/routing/router.js';

export class UserHandler {
    static setupRoutes() {
        Router.getInstance().defineRoute('POST', '/actions/login', (ctx) => {
            ctx.setStatusCode(501)
                .send();
        });
    }
}
