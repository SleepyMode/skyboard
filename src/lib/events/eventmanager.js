import {Log} from '../log/log.js';

export class EventManager {
    static #instance = null;

    static getInstance() {
        if (this.#instance == null) {
            this.#instance = new EventManager();
        }

        return this.#instance;
    }

    listeners = {};
    log = Log.getLogger('Event Manager');

    addListener(eventName, uniqueId, callback) {
        if (!(eventName in this.listeners)) {
            this.listeners[eventName] = {};
        }

        if (uniqueId in this.listeners[eventName]) {
            this.log.caution(`Not adding listener '${uniqueId}' to event '${eventName}' as it is already registered.`);
            return;
        }

        this.listeners[eventName][uniqueId] = callback;
    }

    removeListener(eventName, uniqueId) {
        if (!(eventName in this.listeners)) {
            return;
        }

        this.listeners[eventName][uniqueId] = null;
    }

    dispatch(eventName, ...args) {
        if (!(eventName in this.listeners)) {
            this.log.verbose(`Not dispatching event '${eventName}' as it has no listeners.`);
            return;
        }

        for (const [_, callback] of Object.entries(this.listeners[eventName])) {
            if (callback != null) {
                callback(...args);
            }
        }
    }
}
