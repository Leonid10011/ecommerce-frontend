import { config } from "../config";
import { ApiResponse, Product } from "../types/ApiInterfaces";
import { AcceptEnum, apiRequest } from "./apiRequest";
// Api url stored in config file
const apiPath = config.api_path;
/**
 * Fetches all products from the backend.
 * 
 * This function sends a GET request to the backend to retrieve a list of all products.
 * It returns an ApiResponse containing either an array of Product objects or an error.
 * 
 * @returns Promise<ApiResponse<Product[]>> - A promise that resolves to an ApiResponse, 
 * containing either the list of products (data) or an error object.
 */
const getProducts = async (): Promise<ApiResponse<Product[]>> => {
    const url = `${apiPath}product/get/`;
    return apiRequest(url, 'GET', undefined, undefined, AcceptEnum.json);
}

/**
 * Fetches products by their name from the backend.
 * 
 * This function sends a GET request to the backend to retrieve products matching a specific name.
 * It takes a 'name' parameter and appends it to the request URL.
 * The function returns an ApiResponse containing either an array of Product objects or an error.
 * 
 * @param {string} name - The name of the products to retrieve.
 * @returns Promise<ApiResponse<Product[]>> - A promise that resolves to an ApiResponse,
 * containing either the list of matching products (data) or an error object.
 */
const getProductsByName = async (name: string): Promise<ApiResponse<Product[]>> => {
    const url = `${apiPath}product/getByName/${name}`;
    return apiRequest(url, 'GET', undefined, undefined, AcceptEnum.json);
}

export {
    getProducts, 
    getProductsByName, 
}