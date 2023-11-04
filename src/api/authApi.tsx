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

const api_path = "http://172.17.0.2:8090";

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
        let res = await fetch("/user/login", requestOptions);
        let token = res.text();

        const publicKey = "-----BEGIN PUBLIC KEY----- MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA42s1GTmUx7ZXpuO6SaUCBGEiHqrV8LG3L5QZwqPRiFzkq1z55gbHFVFHvrJsZLfRf9BkZ2CAR1zjRavG1dvYCrbmgkFzZIxNm656e8MaM658ZnrGc2bGnr7L6XxA27VqxIK1N3OwyM+9gzKZqECAViloIwWXtA0AjZipV1EtOTJt7ANYvtLjVyQ4jjCBZ9cS9CdYcWhz7iFwxjlVKzFdU/edZv0A/Eg4m+U3RP/UB6NTw5wmJYIva6CXmqF8yYyV34oMCkbngTg1Gi9Km2BCv0IUOqGHoEOm4gIeAh3NLgDQbP8mHwXoIKdaZA7c52HHpseCN+NhRl97GDmJl/h9nQIDAQAB-----END PUBLIC KEY-----"
      

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

export const signUp= async (userDTO: UserDTO): Promise<SignUpResponseType> => {
    console.log("SignUp User Debug");
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
                roleID: 1,
                password: userDTO.password
            }),
        }

        let res: Response = await fetch('/user/', requestOptions)

        let data: CreateUserResponseType = await res.json();

        //console.log("DATA ", data)

        return {
            data: data,
            status: res.status,
        };

    } catch(err: any){
        console.error("Error: ", err);
        return {
            data: null,
            status: 404
        };
    }

}