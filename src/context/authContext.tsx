import { createContext, useContext, useEffect, useState } from "react";
import { loginUser } from "../api/authApi";
import { useNavigate } from "react-router";
import { decodeToken } from "react-jwt";
import { getOrder } from "../api/dataApi";
import { useOrder } from "./orderContext";


interface AuthContextType {
    token: string,
    fetchAndSetToken: (email: string, password: string) => Promise<void>,
    resetToken: () => void;
    userId: number,
    order: {
        id: number,
        userId: number,
        date: Date,
        status: string
    },
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({
    token: "",
    fetchAndSetToken: async () => {},
    resetToken: () => {},
    userId: 0,
    order: {
        id: 0,
        userId: 0,
        date: new Date(),
        status: ""
    },
    isAuthenticated: false
});

interface TokenType {
    sub: string,
    groups: string[],
    upn: string,
    iat: number,
    exp: number,
    jti: string
}

interface OrderType {
    id: number,
    userId: number,
    date: Date,
    status: string
}

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = (props: {
    children: React.ReactNode,
}) => {
    const navigation = useNavigate();

    const [token, setToken] = useState<string>("");
    const [userId, setUserId] = useState<number>(0);
    const [order, setOrder] = useState<OrderType>({
        id: 0,
        userId: 0,
        date: new Date(),
        status: ""
    });

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const { initOrderContext } = useOrder();

    const fetchAndSetToken = async(email: string, password: string) => {
        const token = await loginUser(email, password);
        if(token){
            try {
                setToken(token);
                navigation("/p");
                const publicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA42s1GTmUx7ZXpuO6SaUCBGEiHqrV8LG3L5QZwqPRiFzkq1z55gbHFVFHvrJsZLfRf9BkZ2CAR1zjRavG1dvYCrbmgkFzZIxNm656e8MaM658ZnrGc2bGnr7L6XxA27VqxIK1N3OwyM+9gzKZqECAViloIwWXtA0AjZipV1EtOTJt7ANYvtLjVyQ4jjCBZ9cS9CdYcWhz7iFwxjlVKzFdU/edZv0A/Eg4m+U3RP/UB6NTw5wmJYIva6CXmqF8yYyV34oMCkbngTg1Gi9Km2BCv0IUOqGHoEOm4gIeAh3NLgDQbP8mHwXoIKdaZA7c52HHpseCN+NhRl97GDmJl/h9nQIDAQAB';
                const decodedToken: TokenType = decodeToken(token)!;
                setUserId(Number(decodedToken.upn));
                const order2: OrderType  = await getOrder(Number(decodedToken.upn));
                setOrder(order2);
                setIsAuthenticated(true);
                initOrderContext(order2.id)

            } catch( err : any){
                console.error("ERROR", err);
            }
        }
    }

    const resetToken = () => {
        setToken("");
    }

    return (
        <AuthContext.Provider value={{token, fetchAndSetToken, resetToken, userId, order, isAuthenticated}}>
            {props.children}
        </AuthContext.Provider>
    );
}


