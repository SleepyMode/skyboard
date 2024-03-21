import {Database} from '../lib/database/database.js';
import {EventManager} from '../lib/events/eventmanager.js';
import * as http from 'http';
import {Router} from '../lib/routing/router.js';
import {Context} from './context.js';
import {PluginManager} from '../lib/plugins/pluginmanager.js';
import * as fs from '../lib/filesystem.js';
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

        await this.setupDatabase();

        EventManager.getInstance().dispatch('setupRoutes');

        this.server = http.createServer(this.requestListener).listen(3000);

        EventManager.getInstance().dispatch('coreAppInitialized');
    }

    shutdown() {
        EventManager.getInstance().removeListener('databaseConnected', 'appDbConnected');
    }

    async setupDatabase() {
        const configPath = '/config/database.yaml';

        if (!await fs.fileExists(configPath)) {
            const defaultPath = '/config/database.default.yaml';

            if (!await fs.copyFile(defaultPath, configPath)) {
                // TODO: Handle not being able to connect.
                return;
            }
        }

        const dbConfig = YAML.parse(await fs.readFile(configPath));
        await Database.getInstance().connect(dbConfig);
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

    async onDatabaseConnected() {
        await Database.create('sb_users')
            .create('uid', 'INT(11) UNSIGNED NOT NULL AUTO_INCREMENT')
            .create('username', 'VARCHAR(120) NOT NULL')
            .create('password', 'VARCHAR(120) NOT NULL')
            .create('salt', 'VARCHAR(15) NOT NULL')
            .primaryKey('uid')
            .execute();

        await Database.create('sb_usergroups')
            .create('uid', 'INT(11) UNSIGNED NOT NULL AUTO_INCREMENT')
            .create('name', 'VARCHAR(120) NOT NULL')
            .create('permissions', 'TEXT NOT NULL')
            .primaryKey('uid')
            .execute();

        // both forums and categories
        await Database.create('sb_forums')
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

        await Database.create('sb_threads')
            .create('uid', 'INT(11) UNSIGNED NOT NULL AUTO_INCREMENT')
            .create('owner', 'INT(11) UNSIGNED NOT NULL')
            .create('title', 'VARCHAR(120) NOT NULL')
            .create('main_post', 'INT(11) UNSIGNED NOT NULL')
            .create('last_post', 'INT(11) UNSIGNED NOT NULL')
            .primaryKey('uid')
            .execute();

        await Database.create('sb_posts')
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