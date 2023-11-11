
import {config} from "../config";
import { ApiResponse } from "../types/ApiInterfaces";
import { ApiError } from "../types/ErrorTypes";

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
        if(!res.ok){
            const error: ApiError = new ApiError(`Error getting favorite items: ${res.status} ${res.statusText}`, res.status);
            error.status = res.status;
            throw error;
        }
        return {
            data: await res.json() as FavoriteProductDTO[],
            error: null 
        };
    } catch(error){
        console.error(`Error retrieving products by name: ${error}`);
        if(error instanceof ApiError){
            return { data: null, error }
        } else {
            return {
                data: null,
                error: new ApiError(`Unexpected Error occured`, 500)}
        }
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
        if(!res.ok){
            const error: ApiError = new ApiError(`Error getting favorite items: ${res.status} ${res.statusText}`, res.status);
            error.status = res.status;
            throw error;
        }
        return {
            data: await res.json() as FavoriteProductDTO,
            error: null 
        };
    } catch(error){
        console.error(`Error retrieving products by name: ${error}`);
        if(error instanceof ApiError){
            return { data: null, error }
        } else {
            return {
                data: null,
                error: new ApiError(`Unexpected Error occured`, 500)}
        }
    }
}

const deleteFavoriteProductByUserAndProduct = async (userId: number, productId: number, token: string): Promise<ApiResponse<boolean>> => {
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
        
        if(!res.ok){
            const error: ApiError = new ApiError(`Error getting favorite items: ${res.status} ${res.statusText}`, res.status);
            error.status = res.status;
            throw error;
        }
        return {
            data: await res.json() as boolean,
            error: null 
        };
    } catch(error){
        console.error(`Error retrieving products by name: ${error}`);
        if(error instanceof ApiError){
            return { data: null, error }
        } else {
            return {
                data: null,
                error: new ApiError(`Unexpected Error occured`, 500)}
        }
    }
}

export {
    createFavoriteItem, 
    deleteFavoriteProductByUserAndProduct,
    getFavoriteItemsByUser
}