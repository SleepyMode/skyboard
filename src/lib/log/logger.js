
export class Logger {
    name;
    output;

    constructor(name, output) {
        this.name = name;
        this.output = output;
    }

    verbose(message) {
        this.output.write(this.name, 'verbose', message);
    }

    info(message) {
        this.output.write(this.name, 'info', message);
    }

    caution(message) {
        this.output.write(this.name, 'caution', message);
    }

    warning(message) {
        this.output.write(this.name, 'warning', message);
    }

    error(message) {
        this.output.write(this.name, 'error', message);
    }
}
