import {Database} from './database.js';

export class Query {
    static SELECT = 0;
    static INSERT = 1;
    static UPDATE = 2;
    static DELETE = 3;
    static CREATE = 4;
    static INSERT_IGNORE = 5;
    static TRUNCATE = 6;
    static ALTER = 7;
    static DROP = 8;

    #callback = null;
    #queryType;
    #tableName;
    #whereList = [];
    #selectList = [];
    #insertList = {keys: [], values: []};
    #updateList = [];
    #createList = [];
    #orderByList = [];
    #add = null;
    #drop = null
    #limit = null
    #offset = null
    #primaryKey = null;

    constructor(queryType, tableName) {
        this.#queryType = queryType;
        this.#tableName = tableName;
    }

    setCallback(callback) {
        this.#callback = callback;
        return this;
    }

    #escape(str) {
        return Database.getInstance().escape(str);
    }

    where(key, value) {
        this.#whereList.push(`\`${key}\` = ${this.#escape(value)}`);
        return this;
    }

    whereNot(key, value) {
        this.#whereList.push(`\`${key}\` != ${this.#escape(value)}`);
        return this;
    }

    whereLike(key, value) {
        this.#whereList.push(`\`${key}\` LIKE ${this.#escape(value)}`);
        return this;
    }

    whereNotLike(key, value) {
        this.#whereList.push(`\`${key}\` NOT LIKE ${this.#escape(value)}`);
        return this;
    }

    whereGT(key, value) {
        this.#whereList.push(`\`${key}\` > ${this.#escape(value)}`);
        return this;
    }

    whereLT(key, value) {
        this.#whereList.push(`\`${key}\` < ${this.#escape(value)}`);
        return this;
    }

    whereGTE(key, value) {
        this.#whereList.push(`\`${key}\` >= ${this.#escape(value)}`);
        return this;
    }

    whereLTE(key, value) {
        this.#whereList.push(`\`${key}\` <= ${this.#escape(value)}`);
        return this;
    }

    orderByDesc(key) {
        this.#orderByList.push(`\`${key}\` DESC`);
        return this;
    }

    orderByAsc(key) {
        this.#orderByList.push(`\`${key}\` ASC`);
        return this;
    }

    select(key) {
        this.#selectList.push(`\`${key}\``);
        return this;
    }

    insert(key, value) {
        this.#insertList.keys.push(`\`${key}\``);
        this.#insertList.values.push(`${this.#escape(value)}`);
        return this;
    }

    update(key, value) {
        this.#updateList.push([`\`${key}\``, `${this.#escape(value)}`]);
        return this;
    }

    create(key, value) {
        this.#createList.push(`\`${key}\` ${value}`);
        return this;
    }

    add(key, value) {
        this.#add = `\`${key}\` ${value}`;
        return this;
    }

    drop(key) {
        this.#drop = `\`${key}\``;
        return this;
    }

    limit(value) {
        this.#limit = value;
        return this;
    }

    offset(value) {
        this.#offset = value;
        return this;
    }

    primaryKey(key) {
        this.#primaryKey = `\`${key}\``;
        return this;
    }

    #buildSelectQuery() {
        let sqlString = 'SELECT ';

        if (this.#selectList.length === 0) {
            sqlString += '*';
        } else {
            sqlString += this.#selectList.join(', ');
        }

        sqlString += ` FROM \`${this.#tableName}\` `;

        if (this.#whereList.length > 0) {
            sqlString += `WHERE ${this.#whereList.join(' AND ')} `;
        }

        if (this.#orderByList.length > 0) {
            sqlString += `ORDER BY ${this.#orderByList.join(', ')} `;
        }

        if (this.#limit != null) {
            sqlString += `LIMIT ${this.#limit} `;
        }

        if (this.#offset != null) {
            sqlString += `OFFSET ${this.#offset} `;
        }

        return sqlString;
    }

    #buildInsertQuery(insertIgnore = false) {
        return `${(insertIgnore) ? 'INSERT IGNORE INTO ' : 'INSERT INTO '} \`${this.#tableName}\``
        + `(${this.#insertList.keys.join(', ')}) VALUES (${this.#insertList.values.join(', ')})`;
    }

    #buildUpdateQuery() {
        let sqlString = `UPDATE \`${this.#tableName}\` SET `;

        this.#updateList.forEach((val) => {
            sqlString += `${val[0]} = ${val[1]}, `;
        });

        // Remove the last comma and space.
        sqlString = sqlString.substring(0, sqlString.length - 2)

        if (this.#whereList.length > 0) {
            sqlString += ` WHERE ${this.#whereList.join(' AND ')} `;
        }

        return sqlString;
    }

    #buildDeleteQuery() {
        let sqlString = `DELETE FROM \`${this.#tableName}\` `;

        if (this.#whereList.length > 0) {
            sqlString += `WHERE ${this.#whereList.join(' AND ')} `;
        }

        if (this.#limit != null) {
            sqlString += `LIMIT ${this.#limit} `;
        }

        return sqlString;
    }

    #buildDropQuery() {
        return `DROP TABLE \`${this.#tableName}\``;
    }

    #buildTruncateQuery() {
        return `TRUNCATE TABLE \`${this.#tableName}\` `;
    }

    #buildCreateQuery() {
        let sqlString = `CREATE TABLE IF NOT EXISTS \`${this.#tableName}\` (${this.#createList.join(', ')} `;

        if (this.#primaryKey != null) {
            sqlString += `, PRIMARY KEY (${this.#primaryKey})`;
        }

        sqlString += ')';
        return sqlString;
    }

    #buildAlterQuery() {
        let sqlString = `ALTER TABLE \`${this.#tableName}\` `;

        if (this.#add != null) {
            sqlString += `ADD ${this.#add}`;
        } else if (this.#drop != null) {
            sqlString += `DROP COLUMN ${this.drop}`;
        }

        return sqlString;
    }

    execute() {
        let sqlString;

        switch (this.#queryType) {
            case Query.SELECT: sqlString = this.#buildSelectQuery(); break;
            case Query.INSERT: sqlString = this.#buildInsertQuery(); break;
            case Query.UPDATE: sqlString = this.#buildUpdateQuery(); break;
            case Query.DELETE: sqlString = this.#buildDeleteQuery(); break;
            case Query.CREATE: sqlString = this.#buildCreateQuery(); break;
            case Query.INSERT_IGNORE: sqlString = this.#buildInsertQuery(true); break;
            case Query.TRUNCATE: sqlString = this.#buildTruncateQuery(); break;
            case Query.ALTER: sqlString = this.#buildAlterQuery(); break;
            case Query.DROP: sqlString = this.#buildDropQuery(); break;
        }

        sqlString = sqlString.trimEnd() + ';';

        Database.getInstance().rawQuery(sqlString, this.#callback);
    }
}