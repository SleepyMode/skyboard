import {Logger} from './logger.js';
import chalk from 'chalk';

export class Log {
    static #instance = null;

    static getInstance() {
        if (this.#instance == null) {
            this.#instance = new Log();
        }

        return this.#instance;
    }

    static getLogger(name) {
        return this.getInstance().getLogger(name);
    }

    static verbose(message) {
        this.getLogger('General').verbose(message);
    }

    static info(message) {
        this.getLogger('General').info(message);
    }

    static caution(message) {
        this.getLogger('General').caution(message);
    }

    static warning(message) {
        this.getLogger('General').warning(message);
    }

    static error(message) {
        this.getLogger('General').error(message);
    }

    loggers = {};

    getLogger(name) {
        if (!this.loggers[name]) {
            this.loggers[name] = new Logger(name, this);
        }

        return this.loggers[name];
    }

    write(logger, severity, message) {
        // TODO: Support multiple outputs aside from just the console
        let result = chalk.bold(logger) + ' | ';

        switch (severity) {
            case 'verbose': result += chalk.blue('VERBOSE'); break;
            case 'info': result += chalk.white('INFO'); break;
            case 'caution': result += chalk.yellow('CAUTION'); break;
            case 'warning': result += chalk.red('WARNING'); break;
            case 'error': result += chalk.red.bgWhite('ERROR'); break;
        }

        result += ' | ' + message;
        console.log(result);
    }
}
