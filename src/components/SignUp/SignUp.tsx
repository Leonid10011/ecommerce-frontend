import { useState } from "react";
import UserForm from "../UserForm/UserForm";
import ErrorBox from "../ErrorBox/ErrorBox";
import BadEmailError from "../../Error/BadEmailError";
import PasswordError from "../../Error/PasswordError";

export default function SignUp(){
    
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordRepeat, setPasswordRepeat] = useState<string>("");
    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>(""); 

    const handleEmail = (e: React.FormEvent<HTMLInputElement>) => {
        const email: HTMLInputElement = e.currentTarget
        if(email){
            setEmail(prev => email.value);
        }
    }  

    const handlePassword = (e: React.FormEvent<HTMLInputElement>) => {
        const password: HTMLInputElement = e.currentTarget
        if(password){
            setPassword(prev => password.value);
        }
    } 
    
    const handlePasswordRepeat = (e: React.FormEvent<HTMLInputElement>) => {
        const password: HTMLInputElement = e.currentTarget
        if(password){
            setPasswordRepeat(prev => password.value);
        }
    } 

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            verifyEmail(email);
            verifyPassword(password, passwordRepeat);
        } catch(err) {
            if(err instanceof BadEmailError){
                setErrorMessage(err.message);
            } else if(err instanceof PasswordError){
                setErrorMessage(err.message);
            }
            setIsError(true);
        } 
    }

    const verifyPassword = (p1: string, p2: string) => {
        if(p1 === p2){
            setErrorMessage("");
            setIsError(false);
        } else {
            throw new PasswordError("Passwords do not match");
        }
    }

    const verifyEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const valid = emailRegex.test(email); 
        if(valid) {
            setErrorMessage("");
            setIsError(false);
        } else {
            throw new BadEmailError("Email must be of the form: john.doe@example.com");
        }
        
    }

    return(
        <UserForm>
            <form 
                className="bg-white p-8 rounded shadow-md max-w-md mt-16"    
                onSubmit={handleSubmit}
            >
                <h2  className="text-2x1 font-bold mb-6">Register</h2>
                {isError ? 
                    <ErrorBox message={errorMessage}/>
                : 
                    ""
                }
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="john.doe@example.com"
                        value={email}
                        onChange={handleEmail}
                    />
                    
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="******"
                        value={password}
                        onChange={handlePassword}
                    />
                    
                </div>

                <div className="mb-4">
                    <label htmlFor="password2" className="block text-gray-700 text-sm font-bold">
                        Repeat Password
                    </label>
                    <input
                        type="password"
                        id="password2"
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="******"
                        value={passwordRepeat}
                        onChange={handlePasswordRepeat}
                    />
                </div>
                
                <button
                    className=" w-full text-white bg-blue-500 rounded p-2 hover:bg-blue-700"
                >
                    Login
                </button>
            </form>
        </UserForm>
    )
} 