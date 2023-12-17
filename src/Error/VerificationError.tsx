class VerificationError extends Error {
    constructor(message: string){
        super(message);
        this.name = "VerificationError";

        Object.setPrototypeOf(this, VerificationError.prototype);
    }
}

export default VerificationError;