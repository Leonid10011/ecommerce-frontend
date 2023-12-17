class BadEmailError extends Error {
    constructor(message: string){
        super(message);
        this.name = "BadEmailError";

        Object.setPrototypeOf(this, BadEmailError.prototype);
    }
}

export default BadEmailError;