import { ApiResponse, User, UserDTO } from '../types/ApiInterfaces';
import { config } from '../config';
import { ApiError } from '../types/ErrorTypes';

const apiPath = config.api_path;

/**
 * Attempts to log in a user with the provided username and password.
 * 
 * @param {string} username - The username of the user attempting to log in.
 * @param {string} password - The password of the user.
 * @returns {Promise<ApiResponse<string>>} - A promise that resolves to an ApiResponse object. 
 *         On success, the ApiResponse's `data` field contains a JWT token as a string. 
 *         On failure, the `data` field is null, and the `error` field contains an ApiError with a descriptive message and HTTP status code.
 * 
 * @example
 * loginUser('username', 'password123')
 *   .then(response => {
 *     if(response.error) {
 *       console.error(response.error.message);
 *     } else {
 *       console.log('Logged in with token:', response.data);
 *     }
 *   });
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
 * Attempts to sign up a new user with the provided user information.
 * 
 * @param {UserDTO} userDTO - An object containing the new user's information. 
 *        It should include username, email, password, and roleId.
 *        The `roleId` should be set according to your system's role configuration 
 *        (e.g., 1 might represent a regular user).
 * 
 * @returns {Promise<ApiResponse<User>>} - A promise that resolves to an ApiResponse object.
 *         On successful signup, the ApiResponse's `data` field contains the newly created User object, 
 *         including the user's ID and other relevant information.
 *         On failure, the `data` field is null, and the `error` field contains an ApiError with a 
 *         descriptive message and the corresponding HTTP status code.
 * 
 * @example
 * const newUser = { username: "newuser", email: "newuser@example.com", password: "password123", roleId: 1 };
 * signUp(newUser)
 *   .then(response => {
 *     if(response.error) {
 *       console.error(response.error.message);
 *     } else {
 *       console.log('User signed up:', response.data);
 *     }
 *   });
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

