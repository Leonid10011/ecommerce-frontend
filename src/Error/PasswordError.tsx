class PasswordError extends Error {
    constructor(message: string){
        super(message);
        this.name = "PasswordError";

        Object.setPrototypeOf(this, PasswordError.prototype);
    }
}

export default PasswordError;