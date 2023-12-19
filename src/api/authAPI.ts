import { API } from "./utils"

interface UserDTO {
    username: string,
    password: string,
    email: string
}

export const signUp = async(formData: UserDTO) => {
    try {
        const res = await API.post("/users/", formData, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch(err) {
        
    }
} 