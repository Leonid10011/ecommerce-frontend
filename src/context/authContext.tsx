import { createContext, useContext, useState } from "react";
import { UserDTO, loginUser, signUp } from "../api/authApi";
import { useNavigate } from "react-router";
import { decodeToken } from "react-jwt";
import { createOrder } from "../api/dataApi";
import { ApiResponse } from "../types/api/apiTypes";
import { create } from "domain";
import { toast } from "react-toastify";

export interface TokenType {
    sub: string,
    groups: string[],
    upn: string,
    iat: number,
    exp: number,
    jti: string
}

export interface OrderType {
    id: number,
    userId: number,
    date: Date,
    status: string
}

interface fetchAndSetTokenType {
    id: number,
    token: string
}

interface AuthContextType {
    token: string,
    fetchAndSetToken: (email: string, password: string) => Promise<Boolean>,
    resetToken: () => void;
    userId: number,
    isAuthenticated: boolean,
    signUpUser: (user: UserDTO) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    token: "",
    fetchAndSetToken:  async ()  => { 
        return false;
    },
    resetToken: () => {},
    userId: 0,
    isAuthenticated: false,
    signUpUser: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = (props: {
    children: React.ReactNode,
}) => {
    const navigation = useNavigate();

    const [token, setToken] = useState<string>("");
    const [userId, setUserId] = useState<number>(0);

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    /**
     * Log in a User and retrieve token and Id
     * @param email 
     * @param password 
     * @returns the token and Id, so we can use immediately in the init Context to initilize all other contexts 
     */
    const fetchAndSetToken = async (email: string, password: string): Promise<Boolean>  => {
        const resToken: ApiResponse<string> = await loginUser(email, password);
        if(resToken.status === 200){

            setToken(resToken.data);
            //decode the token and retrieve userId
            const decodedToken: TokenType = decodeToken(resToken.data)!;
            let id = Number(decodedToken.upn)!
            setUserId(prev => id);
            // notify that the user is authenticated
            setIsAuthenticated(true);
            navigation("/p");

            return true;
        } else {
            return false;
        }
    }
    /**
     * Sign up a User. 
     * @param user 
     * @returns 
     */
    const signUpUser = async (user: UserDTO): Promise<void> => {
        let resSignUp: ApiResponse<UserDTO> = await signUp(user);
        if(resSignUp.status === 201){
            // create a new order for this use on signup
            // will be handled differently in future
            createOrder(resSignUp.data.id, (new Date()), "open");
            // move to login
            navigation("/signin");
        } else if(resSignUp.status === 409){
            toast.error("Username already exists. Please try again.");
        } else {
            toast.error("Unexpected Error.")
        }
    }
    
    const resetToken = () => {
        setToken("");
        setIsAuthenticated(false);
    }

    return (
        <AuthContext.Provider value={{token, fetchAndSetToken, resetToken, userId, isAuthenticated, signUpUser}}>
            {props.children}
        </AuthContext.Provider>
    );
}


