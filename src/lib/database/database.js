
import {DbMySQLDriver} from './drivers/mysql.js';
import {Query} from './query.js';
import {EventManager} from '../events/eventmanager.js';

export class Database {
    static #instance = null;

    static getInstance() {
        if (this.#instance == null) {
            this.#instance = new Database();
        }

        return this.#instance;
    }

    #driver;

    connect(dbConfig) {
        switch (dbConfig.driver.toLowerCase()) {
            case 'mysql':
                this.#driver = new DbMySQLDriver(dbConfig);
                break;
            case 'postgres':
            case 'postgresql':
                // TODO
                break;
            case 'mssql':
                // TODO
                break;
        }

        this.#driver.connect();
        EventManager.getInstance().dispatch('databaseConnected');
    }

    disconnect() {
        return this.#driver.disconnect();
    }

    async query(str) {
        return new Promise((resolve, reject) => {
            this.#driver.query(str, (err, res) => {
                if (err != null) {
                    return reject(err);
                }

                resolve(res);
            });
        });
    }

    querySync(str, callback) {
        return this.#driver.query(str, callback);
    }

    escape(str) {
        return this.#driver.escape(str);
    }

    static select(tableName) {
        return new Query(Query.SELECT, tableName);
    }

    static insert(tableName) {
        return new Query(Query.INSERT, tableName);
    }

    static update(tableName) {
        return new Query(Query.UPDATE, tableName);
    }

    static delete(tableName) {
        return new Query(Query.DELETE, tableName);
    }

    static create(tableName) {
        return new Query(Query.CREATE, tableName);
    }

    static insertIgnore(tableName) {
        return new Query(Query.INSERT_IGNORE, tableName);
    }

    static truncate(tableName) {
        return new Query(Query.TRUNCATE, tableName);
    }

    static alter(tableName) {
        return new Query(Query.ALTER, tableName);
    }

    static drop(tableName) {
        return new Query(Query.DROP, tableName);
    }
}
