import { useState } from "react";
import { loginUser, signUp } from "../api/authApi";
import { ApiResponse, TokenInterface, User, UserDTO } from "../types/ApiInterfaces";
import { decodeToken } from "react-jwt";
import { useNavigate } from "react-router";
import { createOrder } from "../api/orderApi";
import { toast } from "react-toastify";

/**
 * Custom React hook for handling authentication-related operations.
 */
export const useAuthApi = () => {
    const navigation = useNavigate();

    const [token, setToken] = useState<string>("");
    const [userId, setUserId] = useState<number>(0);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    /**
     * Attempts to log in a user using provided credentials, sets the user token and ID.
     * 
     * @param email - The user's email address.
     * @param password - The user's password.
     * @returns A boolean indicating whether authentication was successful.
     */
    const fetchAndSetToken = async (email: string, password: string): Promise<Boolean> => {
        const resToken: ApiResponse<string> = await loginUser(email, password);
        if (resToken.data) {
            setToken(resToken.data);
            const decodedToken: TokenInterface | null = decodeToken(resToken.data);
            if (decodedToken) {
                let id = Number(decodedToken.upn);
                setUserId(prev => id);
                setIsAuthenticated(true);
                navigation("/p");
                return true;
            } else {
                // Handle the case where the token could not be decoded
                return false;
            }
        } else {
            if (resToken.error) {
                console.error(resToken.error.message);
            }
            return false;
        }
    };

    /**
     * Registers a new user and navigates to the sign-in page upon successful registration.
     * 
     * @param user - The user data transfer object (DTO) containing user information.
     */
    const signUpUser = async (user: UserDTO): Promise<void> => {
        let resSignUp: ApiResponse<User> = await signUp(user);
        if (resSignUp.data) {
            createOrder(resSignUp.data.id, (new Date()), "open");
            navigation("/signin");
        } else {
            toast.error("Username already exists. Please try again.");
        }
    };

    /**
     * Resets the authentication token and user-related state.
     */
    const resetToken = () => {
        setToken("");
        setIsAuthenticated(false);
        setUserId(0);
    };

    return { token, userId, fetchAndSetToken, signUpUser, resetToken, isAuthenticated };
};
