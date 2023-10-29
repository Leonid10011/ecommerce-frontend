/**
 * 
 * @param username 
 * @param password 
 * @returns token on success ot empty string on failure
 */
export const loginUser = async (username: string, password: string) => {
    try {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "text/plain"
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
        }
        let res = await fetch("/user/login", requestOptions);
        let data = res.text();
        console.log("Login: ", data);
        return data;
    } catch(err: any){
        console.error("Error: ", err);
    }
}

export interface UserDTO {
    username: string,
    email: string,
    password: string,
}

export const signUp = async (userDTO: UserDTO) => {
    try {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "text/plain"
            },
            body: JSON.stringify({
                username: userDTO.username,
                email: userDTO.email,
                roleID: 1,
                password: userDTO.password
            }),
        }

        let res = await fetch('/user/create', requestOptions);
        
        return res.status;

    } catch(err: any){
        console.error("Error: ", err);
        return 404;
    }

}