import { useState } from "react";
import { loginUser, signUp } from "../api/authApi";
import { ApiResponse, TokenInterface, User, UserDTO } from "../types/ApiInterfaces";
import { decodeToken } from "react-jwt";
import { useNavigate } from "react-router";
import { createOrder } from "../api/orderApi";
import { toast } from "react-toastify";

export const useAuthApi = () => {
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
        if(resToken.data){
            setToken(resToken.data);

            // Decode the token and retrieve useId
            const decodedToken: TokenInterface | null = decodeToken(resToken.data);
            if(decodedToken){
                let id = Number(decodedToken.upn)
                setUserId(prev => id);

                // notify that the user is authenticated
                setIsAuthenticated(true);
                navigation("/p");
                return true
            } else {
                // Need to handle the case where the token could not be decoded
                return false;
            }
        } else {
            if(resToken.error){
                console.error(resToken.error.message);
            }
            return false;
        }
    }

    /**
     * Sign up a User. 
     * @param user 
     * @returns 
     */
    const signUpUser = async (user: UserDTO): Promise<void> => {
        let resSignUp: ApiResponse<User> = await signUp(user);
        if(resSignUp.data){
            // create a new order for this use on signup
            // will be handled differently in future
            createOrder(resSignUp.data.id, (new Date()), "open");
            // move to login
            navigation("/signin");
        } else {
            toast.error("Username already exists. Please try again.");
        }
    }

    const resetToken = () => {
        setToken("");
        setIsAuthenticated(false);
        setUserId(0);
    }

    return { token, userId, fetchAndSetToken, signUpUser, resetToken, isAuthenticated }
}