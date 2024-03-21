import {Database} from '../../lib/database/database.js';

export class User {
    static async findByUniqueId(uniqueId) {
        const result = await Database.select('sb_users')
            .where('uid', uniqueId)
            .execute()
            .catch();

        if (result == null || result.length <= 0) {
            return null;
        }

        const userData = result[0];
        let user = new User();
        user.uniqueId = userData.uid;
        await user.fetch();
        return user;
    }

    static async findByUsername(username, exactMatch = false) {
        let result;
        if (exactMatch) {
            result = await Database.select('sb_users')
                .where('username', username)
                .execute()
                .catch();
        } else {
            result = await Database.select('sb_users')
                .whereLike('username', username)
                .execute()
                .catch();
        }

        if (result == null || result.length <= 0) {
            return null;
        }

        // Not calling fetch here to avoid multiple db calls.
        const userData = result[0];
        let user = new User();
        user.uniqueId = userData.uid;
        user.username = userData.username;
        return user;
    }

    uniqueId;
    username;

    async push() {
        // TODO: Error handling
        await Database.update('sb_users')
            .whereLike('uid', this.uniqueId)
            .update('username', this.username)
            .execute();
    }

    async fetch() {
        const data = await Database.select('sb_users')
            .where('uid', this.uniqueId)
            .execute()
            .catch();

        if (data == null || data.length <= 0) {
            return;
        }

        this.username = data[0].username;
    }

    getUsername() {
        return this.username;
    }

    setUsername(username) {
        this.username = username;
    }
}
