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
    signUpUser: (user: UserDTO) => Promise<number>
}

const AuthContext = createContext<AuthContextType>({
    token: "",
    fetchAndSetToken:  async ()  => { 
        return { id: 0, token: ""} as {id:number; token: string};
    },
    resetToken: () => {},
    userId: 0,
    isAuthenticated: false,
    signUpUser: async () => 404
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
    const fetchAndSetToken = async (email: string, password: string): Promise<fetchAndSetTokenType>  => {
        const token = await loginUser(email, password);
        console.log("TOKEN test: ", token)
        if(token){
            try {
                setToken(token);
                navigation("/p");
                //decode the token and retrieve useId
                const decodedToken: TokenType = decodeToken(token)!;
                let id = Number(decodedToken.upn)!
                setUserId(id);
                // notify that the user is authenticated
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
            if(signUpResponse.status === 201)
                createOrder(signUpResponse.data!.id, (new Date()), "open")
            return signUpResponse.status;
        } catch(err: any) {
            // 404 is placeholder for now
            console.error("Could not create.", err);
            return 404;
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


