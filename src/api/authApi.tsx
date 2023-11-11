import { ApiResponse, User, UserDTO } from '../types/ApiInterfaces';
import { config } from '../config';
import { ApiError } from '../types/ErrorTypes';

const apiPath = config.api_path;

/**
 * Attempts to log in a user with the provided username and password.
 * 
 * @param username The username of the user attempting to log in.
 * @param password The password of the user.
 * @returns An `AuthApiResponse<string>` object containing either a JWT token (as a string) in the `data` field upon successful login, or `null` in the `data` field and an `ApiError` in the `error` field in case of failure.
 *         The `ApiError` includes a descriptive message and the corresponding HTTP status code.
 */
export const loginUser = async (username: string, password: string): Promise<ApiResponse<string>> => {
    try {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "text/plain",
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
        }

        const res: Response = await fetch(`${apiPath}user/login`, requestOptions);
        if(!res.ok){
            const error = new ApiError(`Login failed: ${res.status} ${res.statusText}`, res.status);
            error.status = res.status;
            throw error;
        }
        return { data: await res.text(), error: null }
    } catch(error){
        console.error("Error during login:  ", error)
        if(error instanceof ApiError){
            return { data: null, error}
        } else {
            return {
                data: null,
                error: new ApiError("An unexpected error occurred", 500)
            }
        };
    }
}

/**
 *  Attemps to sign up a user with the provided username, email and passwords
 * 
 * @param user Holds user related infomation during sign up 
 * @returns An `AuthApiResponse<User>` object containing either the created user with a correct id in the `data` field and null in the `error` field, or null in the `data` field and `ApiError` in the error field.
 *          The `ApiError` includes a descriptive message and the corresponding HTTP status code.
*/
export const signUp= async (userDTO: UserDTO): Promise<ApiResponse<User>> => {
    try {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                username: userDTO.username,
                email: userDTO.email,
                roleId: 1,
                password: userDTO.password
            }),
        }
    
        const res: Response = await fetch(`${apiPath}user/`, requestOptions);

        if(!res.ok){
            const error = new ApiError(`Signup failed: ${res.status} ${res.statusText}`, res.status);
            error.status = res.status;
            throw error;
        }

        return {
            data: await res.json() as User,
            error: null
        }
    } catch(error){
        console.error(`Error during signup ${error}`);
        if(error instanceof ApiError){
            return { data: null, error}
        } else {
            return {
                data: null,
                error: new ApiError(`Unexpected Error occured. `, 500)
            }
        }
    }
}

