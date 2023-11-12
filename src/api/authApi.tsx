import { ApiResponse, User, UserDTO } from '../types/ApiInterfaces';
import { config } from '../config';
import { AcceptEnum, apiRequest } from './apiRequest';
import { LoginRequestBody, SignUpRequestBody } from '../types/RequestBodyInterfaces';

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
    const url = `${apiPath}user/login`;
    const body: LoginRequestBody = {
        username: username,
        password: password
    };

    return apiRequest(url, 'POST',body, '', AcceptEnum.text);
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
    const url = `${apiPath}user/`;
    const body: SignUpRequestBody = {
        username: userDTO.username,
        email: userDTO.email,
        roleId: 1,
        password: userDTO.password
    };
    return apiRequest(url, 'POST', body,'',AcceptEnum.json);
}

