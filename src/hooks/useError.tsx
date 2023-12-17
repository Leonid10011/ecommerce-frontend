import { useState } from "react"

interface ErrorHookReturn {
    isError: boolean,
    errorMessage: string,
    createError: (message: string) => void,
    clearError: () => void,
}

export default function useError(): ErrorHookReturn{
    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const createError = (message: string) => {
        setErrorMessage(message);
        setIsError(true);
    };

    const clearError = () => {
        setErrorMessage("");
        setIsError(false);
    }

    return { isError, errorMessage, createError, clearError}
}