import { ApiResponse } from '../types/api/apiTypes';
import { config } from '../config';

const apiPath = config.api_path;

/**
 * 
 * @param username 
 * @param password 
 * @returns token on success ot empty string on failure
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
        if(res.ok){
            const data: string = await res.text();
            return {
                data,
                status: res.status
            }
        } else {
            return {
                data: "",
                status: res.status
            }
        }
        
    } catch(error){
        // netwotk error hadnling
        console.error("Error log in user ", error)
        throw error;
    }
}

export interface UserDTO {
    id: number,
    username: string,
    email: string,
    roleId: number
    password: string,
}
/**
 *  retrive a userDTO after success
 * @param userDTO 
 * @returns 
 */
export const signUp= async (userDTO: UserDTO): Promise<ApiResponse<UserDTO>> => {
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
        if(res.status === 201){
            const data: UserDTO = await res.json() as UserDTO;
            return {
                data,
                status: res.status,
            }
        } else if(res.status === 409) {
            // return a emtpy data. Won't be used anyway. But need to find better solution
            return {
                data: {
                    id: -1,
                    username: "",
                    email: "",
                    roleId: 0,
                    password: ""
                },
                status: res.status,
            }
        } else {
            // if not ok or no conflict, we want to notify that some other error occured
            return {
                data: {
                    id: -1,
                    username: "",
                    email: "",
                    roleId: 0,
                    password: ""
                },
                status: res.status,
            }
        }
    } catch( error ){
        // network error
        console.error("Unexpected Error ", error);
        throw error;
    }
}

