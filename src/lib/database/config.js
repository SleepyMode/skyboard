
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
}
