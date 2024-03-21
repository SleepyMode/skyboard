
import mysql from 'mysql2';

export class DbMySQLDriver {
    #connection;
    #connected;
    #config;

    constructor(dbConfig) {
        this.#config = dbConfig;
    }

    connect() {
        this.#connection = mysql.createConnection({
            host:       this.#config.hostname,
            port:       this.#config.port,
            user:       this.#config.username,
            password:   this.#config.password,
            database:   this.#config.database,
            charset:    this.#config.charset,
            timezone:   this.#config.timezone
        });

        this.#connection.connect((err) => {
            if (err) {
                this.#connected = false;
                return;
            }

            this.#connected = true;
        });
    }

    disconnect() {
        if (this.#connected) {
            this.#connection.end();
        }
    }

    escape(str) {
        return mysql.escape(str);
    }

    query(str, callback) {
        return this.#connection.query(str, callback);
    }
}
