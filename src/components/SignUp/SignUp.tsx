import { useState } from "react";
import UserForm from "../UserForm/UserForm";
import ErrorBox from "../ErrorBox/ErrorBox";
import useError from "../../hooks/useError";
import { verifyEmail, verifyMatchPassword, verifyPassword } from "../../utils/verification";
import VerificationError from "../../Error/VerificationError";

export default function SignUp(){
    
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordRepeat, setPasswordRepeat] = useState<string>("");
    const { isError, errorMessage, createError, clearError } = useError();

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
            clearError();
            verifyEmail(email);
            verifyPassword(password);
            verifyMatchPassword(password, passwordRepeat);
        } catch (err ) {
            if(err instanceof VerificationError)
                createError(err.message);
            else 
                createError("Unexpected error occurred")
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