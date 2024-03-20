import {Database} from '../lib/database/database.js';
import {EventManager} from '../lib/events/eventmanager.js';
import * as http from 'http';
import {Router} from '../lib/routing/router.js';
import {Context} from './context.js';
import {PluginManager} from '../lib/plugins/pluginmanager.js';
import path from 'path';
import fs from 'fs/promises';
import YAML from 'yaml';

export class App {
    static #instance = null;

    static getInstance() {
        if (this.#instance == null) {
            this.#instance = new App();
        }

        return this.#instance;
    }

    server;

    async initialize() {
        // Set up listeners so that plugins can modify these.
        // If it was just a function call it'd be more difficult
        // to modify the core app's behavior.
        EventManager.getInstance().addListener('databaseConnected', 'appDbConnected', this.onDatabaseConnected);
        EventManager.getInstance().addListener('setupRoutes', 'appSetupRoutes', this.setupRoutes);

        await PluginManager.getInstance().loadAllPlugins();
        EventManager.getInstance().dispatch('pluginsLoaded');

        const dbConfigPath = path.join(globalThis.sbRoot, '/config/database.yaml');
        const dbConfigFile = await fs.readFile(dbConfigPath, {
            encoding: 'utf8'
        });
        const dbConfig = YAML.parse(dbConfigFile);
        await Database.getInstance().connect(dbConfig);

        EventManager.getInstance().dispatch('setupRoutes');

        this.server = http.createServer(this.requestListener).listen(3000);

        EventManager.getInstance().dispatch('coreAppInitialized');
    }

    shutdown() {
        EventManager.getInstance().removeListener('databaseConnected', 'appDbConnected');
    }

    requestListener(req, res) {
        console.log('----- new request ------');
        console.log('method', req.method);
        console.log('url', req.url);
        console.log('----- end request ------');

        const [route, match] = Router.getInstance().parse(req);
        if (route == null) {
            new Context(req, res, {})
                .setStatusCode(404)
                .setContent('<html lang="en"><body>Not found.</body></html>')
                .send();
            return;
        }

        route.handler(new Context(req, res, match.params));
    }

    onDatabaseConnected() {
        Database.create('sb_users')
            .create('uid', 'INT(11) UNSIGNED NOT NULL AUTO_INCREMENT')
            .create('username', 'VARCHAR(120) NOT NULL')
            .create('password', 'VARCHAR(120) NOT NULL')
            .create('salt', 'VARCHAR(15) NOT NULL')
            .primaryKey('uid')
            .execute();

        Database.create('sb_usergroups')
            .create('uid', 'INT(11) UNSIGNED NOT NULL AUTO_INCREMENT')
            .create('name', 'VARCHAR(120) NOT NULL')
            .create('permissions', 'TEXT NOT NULL')
            .primaryKey('uid')
            .execute();

        // both forums and categories
        Database.create('sb_forums')
            .create('uid', 'INT(11) UNSIGNED NOT NULL AUTO_INCREMENT')
            .create('name', 'VARCHAR(120) NOT NULL')
            .create('description', 'VARCHAR(120) DEFAULT NULL')
            .create('display_order', 'SMALLINT(5) DEFAULT 0')
            .create('threads', 'INT(11) UNSIGNED DEFAULT 0')
            .create('posts', 'INT(11) UNSIGNED DEFAULT 0')
            .create('last_post', 'INT(11) UNSIGNED DEFAULT NULL')
            .create('parent', 'INT(11) UNSIGNED DEFAULT NULL')
            .primaryKey('uid')
            .execute();

        Database.create('sb_threads')
            .create('uid', 'INT(11) UNSIGNED NOT NULL AUTO_INCREMENT')
            .create('owner', 'INT(11) UNSIGNED NOT NULL')
            .create('title', 'VARCHAR(120) NOT NULL')
            .create('main_post', 'INT(11) UNSIGNED NOT NULL')
            .create('last_post', 'INT(11) UNSIGNED NOT NULL')
            .primaryKey('uid')
            .execute();

        Database.create('sb_posts')
            .create('uid', 'INT(11) UNSIGNED NOT NULL AUTO_INCREMENT')
            .create('owner', 'INT(11) UNSIGNED NOT NULL')
            .create('thread', 'INT(11) UNSIGNED NOT NULL')
            .create('date', 'BIGINT UNSIGNED NOT NULL')
            .create('message', 'TEXT')
            .primaryKey('uid')
            .execute();
    }

    setupRoutes() {
        Router.getInstance().defineRoute('GET', '/', (ctx) => {
            console.log(ctx.arguments);
            //ctx.setContent('<html lang="en"><body>Testing...</body></html>')
            //    .send();
            ctx.setView('index', {})
                .send();
        });

        Router.getInstance().defineRoute('GET', '/test/:test-:test2', (ctx) => {
            console.log(ctx.arguments);
            ctx.setContent('<html lang="en"><body>Testing with args...</body></html>')
                .send();
        })
    }
}