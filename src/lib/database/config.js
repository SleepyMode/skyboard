
import YAML from 'yaml';
import * as fs from 'fs';
import * as path from 'path';

export class DbConfig {
    driver;

    hostname;
    username;
    password;
    database;
    port;

    charset;
    timezone;

    constructor(driver, host, user, pass, db, port= null, charset= null, timezone = null) {
        this.driver = driver;
        this.hostname = host;
        this.username = user;
        this.database = db;
        this.port = port;
        this.charset = charset;
        this.timezone = timezone;
    }

    static loadConfig() {
        const configPath = path.join(globalThis.sbRoot, '/config/database.yaml');
        const config = YAML.parse(fs.readFileSync(configPath, 'utf8'));
        console.log(config);
        return new DbConfig(config.driver, config.hostname, config.username,
            config.database, config.port, config.charset, config.timezone);
    }
}
