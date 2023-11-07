
import {config} from "../config";
import { ApiResponse } from "../types/api/apiTypes";

const apiPath = config.api_path;

export interface FavoriteProductDTO {
    id: number,
    userId: number,
    productId: number
}

const getFavoriteItemsByUser = async (userId: number): Promise<ApiResponse<FavoriteProductDTO[]>> => {
    try {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }

        const res:  Response = await fetch(`${apiPath}favoriteItem/getProductIdsByUser/${userId}`, requestOptions); 
        if(res.ok) {
            const data: FavoriteProductDTO[] = await res.json() as FavoriteProductDTO[];
            return {
                data,
                status: res.status
            }
        } else {
            throw new Error(`HTTP error! status: ${res.status}` )
        }
    } catch (error){
        console.error('Error requestin favorite items.', error);
        throw error;
    }
}



const createFavoriteItem = async (userId: number, productId: number, token: string): Promise<ApiResponse<FavoriteProductDTO>> => {
    console.log("Create Favorite Item Debug");
    try {
        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                userId: userId,
                productId: productId
            })
        };

        let res: Response = await fetch(`${apiPath}favoriteItem/`, requestOptions);
        if(res.status === 201){
            const data: FavoriteProductDTO = await res.json() as FavoriteProductDTO;
            return {
                data,
                status: res.status
            };
        }
        else {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        } catch(error){
            console.error("Error creating favorite items. ", error);
            throw error
    }
}

const deleteFavoriteProductByUserAndProduct = async (userId: number, productId: number, token: string): Promise<ApiResponse<Boolean>> => {
    console.log("Delete Favorite Products BY User & Product Debug");
    try {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                id: 0,
                userId: userId,
                productId: productId
            })
        };

        let res = await fetch(`${apiPath}favoriteItem/delete`, requestOptions);
        return {
            data: true,
            status: res.status
        }

    } catch(error){
        console.error("Error deleting favorite items. ", error);
        throw error
    }
}

export {
    createFavoriteItem, 
    deleteFavoriteProductByUserAndProduct,
    getFavoriteItemsByUser
}