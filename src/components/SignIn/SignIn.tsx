import { useState } from "react";
import UserForm from "../UserForm/UserForm";

export default function SignIn(){
    
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

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

    const handleSubmit = () => {
        console.log("Submit not implemented");
    }

    return(
        <UserForm>
            <form 
                className="bg-white p-8 rounded shadow-md max-w-md mt-16"    
                onSubmit={handleSubmit}
            >
                <h2  className="text-2x1 font-bold mb-6">Sign In</h2>
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
                
                <button
                    className=" w-full text-white bg-blue-500 rounded p-2 hover:bg-blue-700"
                >
                    Login
                </button>
            </form>
        </UserForm>
    )
} 