import { createContext, useContext, useEffect, useState } from "react";
import { loginUser } from "../api/authApi";

interface AuthContextType {
    token: string,
    fetchAndSetToken: (email: string, password: string) => Promise<void>,
    resetToken: () => void;
}

const AuthContext = createContext<AuthContextType>({
    token: "",
    fetchAndSetToken: async () => {},
    resetToken: () => {}
});


export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = (props: {
    children: React.ReactNode,
}) => {

    const [token, setToken] = useState<string>("");
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const fetchAndSetToken = async(email: string, password: string) => {
        const token = await loginUser(email, password);
        if(token){
            setToken(token);
        }
    }

    const resetToken = () => {
        setToken("");
    }

    return (
        <AuthContext.Provider value={{token, fetchAndSetToken, resetToken}}>
            {props.children}
        </AuthContext.Provider>
    );
}


