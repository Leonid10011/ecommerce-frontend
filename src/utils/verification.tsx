import VerificationError from "../Error/VerificationError";

export const verifyPassword = (password: string) => {
    const pattern: RegExp = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if(!pattern.test(password)){
        throw new VerificationError("Password needs at least 1 capital letter, 1 number and length at least 6");
    }
}

export const verifyMatchPassword = (password1: string, password2: string) => {
    if(password1 !== password2){
        throw new VerificationError("Passwords do not match");
    }
}

export const verifyEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = emailRegex.test(email); 
    if(!valid){
        throw new VerificationError("Email must be of the form: john.doe@example.com");
    }
}