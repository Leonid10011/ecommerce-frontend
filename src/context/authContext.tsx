import { createContext, useContext, useState } from "react";
import { UserDTO, loginUser, signUp } from "../api/authApi";
import { useNavigate } from "react-router";
import { decodeToken } from "react-jwt";
import { createOrder } from "../api/dataApi";

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
    fetchAndSetToken: (email: string, password: string) => Promise<fetchAndSetTokenType>,
    resetToken: () => void;
    userId: number,
    isAuthenticated: boolean,
    signUpUser: (user: UserDTO) => void
}

const AuthContext = createContext<AuthContextType>({
    token: "",
    fetchAndSetToken:  async ()  => { 
        return { id: 0, token: ""} as {id:number; token: string};
    },
    resetToken: () => {},
    userId: 0,
    isAuthenticated: false,
    signUpUser: () => {}
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
     * @returns 
     */
    const fetchAndSetToken = async (email: string, password: string): Promise<fetchAndSetTokenType>  => {
        const token = await loginUser(email, password);
        console.log("TOKEN ", token)
        if(token){
            try {
                setToken(token);
                navigation("/p");
                const decodedToken: TokenType = decodeToken(token)!;
                let id = Number(decodedToken.upn)!
                setUserId(id);
                setIsAuthenticated(true);

                return {id, token}; 
            } catch( err : any){
                console.error("ERROR", err);
                return {id: 0, token: ""};
            }
        }else {
            return {id: 0, token: ""};
        }
    }
    /**
     * SIgn up a User. 
     * @param user 
     * @returns 
     */
    const signUpUser = async (user: UserDTO) => {
        try {
            let signUpResponse = await signUp(user);
            createOrder(signUpResponse.data!.id, (new Date()), "open")
        } catch(err: any) {
            console.log("Could not create.");
        }
    }
    
    const resetToken = () => {
        setToken("");
    }

    return (
        <AuthContext.Provider value={{token, fetchAndSetToken, resetToken, userId, isAuthenticated, signUpUser}}>
            {props.children}
        </AuthContext.Provider>
    );
}


