import { config } from "../config";
import { ApiResponse } from "../types/ApiInterfaces";
import { ApiError } from "../types/ErrorTypes";

const apiPath = config.api_path;

export interface Product {
    id: number,
    name: string,
    description: string,
    price: number,
    categoryID: number,
    quantity: number,
    imgURL: string,
}

/** Attemps to get all products from the backend.
 * @returns 
 */
const getProducts = async (): Promise<ApiResponse<Product[]>> => {
    try {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        };
        const res: Response = await fetch(`${apiPath}product/get/`, requestOptions);
        if(!res.ok){
            const error = new ApiError(`Getting products failed: ${res.status} ${res.statusText}`, res.status);
            error.status = res.status;
            throw error;
        }
        return {
            data: await res.json() as Product[],
            error: null
        } 
    } catch(error){
        console.error(`Error getting products ${error}`);
        if(error instanceof ApiError){
            return {
                data: null,
                error: error
            }
        } else {
            return {
                data: null,
                error: new ApiError(`Unexpected Error occured.`, 500)
            }
        }

    }
}

const getProductsByName = async (name: string): Promise<ApiResponse<Product[]>> => {
    try {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        };
        const res: Response = await fetch(`${apiPath}product/getByName/${name}`, requestOptions);
        if(!res.ok){
            const error: ApiError = new ApiError(`Error getting products by name: ${res.status} ${res.statusText}`, res.status);
            error.status = res.status;
            throw error;
        }
        return {
            data: await res.json() as Product[],
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
    getProducts, 
    getProductsByName, 
}