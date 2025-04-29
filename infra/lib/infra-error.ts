export class InfraError extends Error {
    constructor(message: string, cause?: ErrorOptions["cause"]) {
        super(message, { cause });
        this.name = new.target.name; // automatically take child class name
    }
}