import { createContext, useContext, useEffect, useState } from "react";
import { loginUser } from "../api/authApi";
import { useNavigate } from "react-router";
import { useJwt, decodeToken } from "react-jwt";


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

interface TokenType {
    sub: string,
    groups: string[],
    upn: string,
    iat: number,
    exp: number,
    jti: string
}

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = (props: {
    children: React.ReactNode,
}) => {
    const navigation = useNavigate();

    const [token, setToken] = useState<string>("");
    const [userId, setUserId] = useState<number>(0);

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const fetchAndSetToken = async(email: string, password: string) => {
        const token = await loginUser(email, password);
        if(token){
            setToken(token);
            navigation("/p");
            const publicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA42s1GTmUx7ZXpuO6SaUCBGEiHqrV8LG3L5QZwqPRiFzkq1z55gbHFVFHvrJsZLfRf9BkZ2CAR1zjRavG1dvYCrbmgkFzZIxNm656e8MaM658ZnrGc2bGnr7L6XxA27VqxIK1N3OwyM+9gzKZqECAViloIwWXtA0AjZipV1EtOTJt7ANYvtLjVyQ4jjCBZ9cS9CdYcWhz7iFwxjlVKzFdU/edZv0A/Eg4m+U3RP/UB6NTw5wmJYIva6CXmqF8yYyV34oMCkbngTg1Gi9Km2BCv0IUOqGHoEOm4gIeAh3NLgDQbP8mHwXoIKdaZA7c52HHpseCN+NhRl97GDmJl/h9nQIDAQAB';
            try {
                const decodedToken: TokenType = decodeToken(token)!;
                setUserId(Number(decodedToken.upn))
                console.log("DECODE: ", userId );
            } catch( err : any){
                console.error("ERROR");
            }
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


