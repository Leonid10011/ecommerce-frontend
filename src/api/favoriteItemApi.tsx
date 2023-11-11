
import {config} from "../config";
import { ApiResponse } from "../types/ApiInterfaces";
import { ApiError } from "../types/ErrorTypes";

const apiPath = config.api_path;

export interface FavoriteProduct {
    id: number,
    userId: number,
    productId: number
}

/**
 * Retrieves favorite items of a specific user.
 * 
 * This function makes a GET request to fetch all favorite products associated with a given user ID.
 * It returns an ApiResponse containing either an array of FavoriteProduct objects or an error.
 *
 * @param {number} userId - The ID of the user whose favorite items are to be fetched.
 * @returns {Promise<ApiResponse<FavoriteProduct[]>>} A promise that resolves to an ApiResponse.
 */
const getFavoriteItemsByUser = async (userId: number): Promise<ApiResponse<FavoriteProduct[]>> => {
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
            data: await res.json() as FavoriteProduct[],
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

/**
 * Creates a new favorite item.
 * 
 * This function sends a POST request to add a product to a user's favorites list.
 * It takes a user ID, product ID, and an authentication token as parameters.
 * On success, it returns an ApiResponse containing the created FavoriteProduct object.
 *
 * @param {number} userId - The ID of the user.
 * @param {number} productId - The ID of the product to be added to favorites.
 * @param {string} token - The authentication token.
 * @returns {Promise<ApiResponse<FavoriteProduct>>} A promise that resolves to an ApiResponse.
 */
const createFavoriteItem = async (userId: number, productId: number, token: string): Promise<ApiResponse<FavoriteProduct>> => {
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
            data: await res.json() as FavoriteProduct,
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

/**
 * Deletes a favorite product for a user.
 * 
 * This function sends a DELETE request to remove a product from a user's favorites list.
 * It takes the user's ID, the product's ID, and an authentication token as parameters.
 * On success, it returns an ApiResponse indicating whether the deletion was successful.
 *
 * @param {number} userId - The ID of the user.
 * @param {number} productId - The ID of the product to be removed from favorites.
 * @param {string} token - The authentication token.
 * @returns {Promise<ApiResponse<boolean>>} A promise that resolves to an ApiResponse.
 */
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