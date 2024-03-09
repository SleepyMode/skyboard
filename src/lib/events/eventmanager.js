
export class EventManager {
    static #instance = null;

    static getInstance() {
        if (this.#instance == null) {
            this.#instance = new EventManager();
        }

        return this.#instance;
    }

    listeners = {};

    addListener(eventName, uniqueId, callback) {
        if (!(eventName in this.listeners)) {
            this.listeners[eventName] = {};
        }

        if (uniqueId in this.listeners[eventName]) {
            // TODO log
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
            // TODO log
            return;
        }

        this.listeners[eventName].forEach((callback) => {
            if (callback != null) {
                callback(...args);
            }
        });
    }
}
