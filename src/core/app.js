import {Database} from "../lib/database/database.js";
import {EventManager} from "../lib/events/eventmanager.js";

export class App {
    static #instance = null;

    static getInstance() {
        if (this.#instance == null) {
            this.#instance = new App();
        }

        return this.#instance;
    }

    initialize() {
        EventManager.getInstance().addListener('databaseConnected', 'appDbConnected', this.onDatabaseConnected);
        EventManager.getInstance().dispatch('coreAppInitialized');
    }

    shutdown() {
        EventManager.getInstance().removeListener('databaseConnected', 'appDbConnected');
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
}