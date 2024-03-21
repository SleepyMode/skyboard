import {Database} from '../../lib/database/database.js';

export class User {
    static findByUniqueId(uniqueId) {
    }

    static findByUsername(username) {
    }

    uniqueId;
    username;

    constructor(uniqueId) {
        Database.select('sb_users')
            .where('uid', uniqueId)
            .setCallback((err, res, fields) => {
                console.log(err);
                console.log('!!!!!!');
                console.log(res);
                console.log('!!!!!!');
                console.log(fields);
            })
            .execute();
    }

    getUsername() {
    }

    setUsername(username) {
    }
}
