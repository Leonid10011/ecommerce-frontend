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
        return data;
    } catch(err: any){
        console.error("Error: ", err);
    }
}

interface UserDTO {
    username: string,
    forename: string,
    surname: string,
    city: string,
    country: string,
    street: string,
    zipCode:string,
    phone: string,
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
                forename: userDTO.forename,
                surname: userDTO.surname,
                city: userDTO.city,
                country: userDTO.country,
                street: userDTO.street,
                zipCode: userDTO.zipCode,
                phone: userDTO.phone,
                email: userDTO.email,
                roleID: 1,
                password: userDTO.password
            }),
        }

        await fetch('/user/create', requestOptions);
        return true;    

    } catch(err: any){
        console.error("Error: ", err);
        return false;
    }

}