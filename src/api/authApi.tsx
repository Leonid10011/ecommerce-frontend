import { error } from 'console';
import * as jwt from 'jsonwebtoken';

interface CreateUserResponseType {
    id: number,
    username: string,
    password: string,
    email: string,
    roleId: number

}

interface SignUpResponseType {
    data: CreateUserResponseType | null,
    status: number
}

const api_path = "http://85.215.54.122";

/**
 * 
 * @param username 
 * @param password 
 * @returns token on success ot empty string on failure
 */
export const loginUser = async (username: string, password: string) => {
    console.log("Login User Debug");
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
        let res = await fetch(api_path + "/user/login", requestOptions);
        let token = res.text();

        console.log("Login: ", token);
        
        return token;
    } catch(err: any){
        console.error("Error: ", err);
    }
}

export interface UserDTO {
    username: string,
    email: string,
    password: string,
}
/**
 *  retrive a userDTO after success
 * @param userDTO 
 * @returns 
 */
export const signUp= async (userDTO: UserDTO): Promise<SignUpResponseType> => {
    console.log("SignUp User Debug");
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            username: userDTO.username,
            email: userDTO.email,
            roleID: 1,
            password: userDTO.password
        }),
    }

    let resStatus;

    let res: CreateUserResponseType = await fetch(api_path + '/user/', requestOptions)
    .then(response => {
        if(!response.ok) {
            resStatus = response.status;
            throw new Error(`${response.status}`);
        }
        resStatus = 201;
        return response.json();
    })
    .catch(error => {
        if(error.message === '409') {
            console.error('Konflikt');
            resStatus = 409;
        } else {
            console.error('Ein Fehler');
            resStatus = error.message;
        }
    })

    //console.log("DATA ", data)

    return {
        data: res,
        status: Number(resStatus),
    };
}

