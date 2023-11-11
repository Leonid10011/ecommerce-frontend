import { config } from "../config";
import { ApiResponse } from "../types/ApiInterfaces";

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

/**
 * @description Retrieve Products from RESTApi.
 * @returns products and status code
 */
const getProducts = async (): Promise<ApiResponse<Product[]>> => {
    console.log("Get Products Debug");
    try {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        };
    
        const res: Response = await fetch(`${apiPath}product/get/`, requestOptions);
        const data: Product[] = await res.json() as Product[];
        if(res.ok){
            return {
                data,
                status: res.status
            };
        } else {
            throw new Error(`HTTP Error with status: ${res.status}`);
        }
    } catch(error){
        console.error(`Error getting products ${error}`);
        throw error;
    }
}

const getProductsByName = async (name: string): Promise<ApiResponse<Product[]>> => {
    console.log("Get Products By Name Debug");
    try {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        };

        const res: Response = await fetch(`${apiPath}product/getByName/${name}`, requestOptions);
        const data: Product[] = await res.json() as Product[];
        
        if(res.ok){
            return {
                data,
                status: res.status
            };
        } else {
            throw new Error(`HTTP Error with status code ${res.status}`);
        };
    } catch(error){
        console.error(`Error retrieving products by name: ${error}`);
        throw error;
    }
}

export {
    getProducts, 
    getProductsByName, 
}