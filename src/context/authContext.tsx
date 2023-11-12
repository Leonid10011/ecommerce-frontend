import { createContext, useContext, useEffect, useState } from "react";
import { UserDTO } from "../types/ApiInterfaces";

import { useAuthApi } from "../hooks/useAuthApi";

interface AuthContextType {
    token: string,
    fetchAndSetToken: (email: string, password: string) => Promise<Boolean>,
    resetToken: () => void;
    userId: number,
    signUpUser: (user: UserDTO) => Promise<void>,
    isAuthenticated: boolean,
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = (props: {
    children: React.ReactNode,
}) => {

    const { token, userId, fetchAndSetToken, signUpUser, resetToken, isAuthenticated } = useAuthApi();

    const value = {
        token, 
        fetchAndSetToken, 
        resetToken, 
        userId, 
        signUpUser,
        isAuthenticated, 
    }

    return (
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
};


