
import { Api } from "@mui/icons-material";
import {config} from "../config";
import { ApiResponse } from "../types/ApiInterfaces";
import { ApiError } from "../types/ErrorTypes";
import { AcceptEnum, apiRequest } from "./apiRequest";

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
 * @returns {Promise<ApiResponse<FavoriteProduct[]>>} - A promise that resolves to an ApiResponse,
 * containing either the list of favorite products (data) or an error object.
 */
const getFavoriteItemsByUser = async (userId: number): Promise<ApiResponse<FavoriteProduct[]>> => {
    const url = `${apiPath}favoriteItem/getProductIdsByUser/${userId}`;
    return apiRequest(url, 'GET', undefined, undefined, AcceptEnum.json);
}
interface CreateFavoriteItemBody {
    userId: number,
    productId: number
}
/**
 * Creates a new favorite item for a user.
 * 
 * This function sends a POST request to add a specified product to a user's favorite list.
 * It requires the user's ID, product ID, and an authentication token.
 * On success, it returns an ApiResponse containing the created FavoriteProduct object.
 *
 * @param {number} userId - The ID of the user.
 * @param {number} productId - The ID of the product to be added to favorites.
 * @param {string} token - The authentication token.
 * @returns {Promise<ApiResponse<FavoriteProduct>>} - A promise that resolves to an ApiResponse,
 * containing either the newly created favorite product (data) or an error object.
 */
const createFavoriteItem = async (userId: number, productId: number, token: string): Promise<ApiResponse<FavoriteProduct>> => {
    const url = `${apiPath}favoriteItem/`;
    const body: CreateFavoriteItemBody = {
        userId: userId,
        productId: productId
    };
    return apiRequest(url, 'POST', body, token, AcceptEnum.json);
}

/**
 * Deletes a favorite item by its ID.
 * 
 * This function sends a DELETE request to remove a favorite item specified by its ID.
 * It requires the favorite item's ID and an authentication token.
 * On success, it returns an ApiResponse indicating whether the deletion was successful.
 *
 * @param {number} favoriteProductId - The ID of the favorite product to be deleted.
 * @param {string} token - The authentication token.
 * @returns {Promise<ApiResponse<boolean>>} - A promise that resolves to an ApiResponse,
 * indicating the success (data: true) or failure (data: false) of the deletion, or an error object.
 */
const deleteFavoriteProduct = async (favoriteProductId: number, token: string): Promise<ApiResponse<boolean>> =>  {
    const url = `${apiPath}favoriteItem/delete/${favoriteProductId}`;
    return apiRequest(url, 'DELETE', undefined, token, undefined);
}

export {
    createFavoriteItem, 
    deleteFavoriteProduct,
    getFavoriteItemsByUser
}