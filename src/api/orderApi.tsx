import {config} from "../config";
import { OrderProduct } from "../../misc/orderContext";
import { ApiResponse, ApiSuccessResponse } from "../types/ApiInterfaces";
import { ApiError } from "../types/ErrorTypes";
import { Product } from "./productApi";

const apiPath = config.api_path;

export interface OrderDTO {
    id: number,
    userId: number,
    date: Date,
    status: string,
}

export interface OrderItemDTO {
    id: number,
    orderId: number,
    productId: number,
    quantity: number,
    price: number,
}

const createOrder = async (userId: number, date: Date, status: string): Promise<ApiResponse<OrderDTO>> => {
    try {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                userId: userId,
                date: date,
                status: status
            })
        };

        const res: Response = await fetch(`${apiPath}order/create`, requestOptions);
        if(!res.ok){
            const error: ApiError = new ApiError(`Error getting favorite items: ${res.status} ${res.statusText}`, res.status);
            throw error;
        }
        return {
            data: await res.json() as OrderDTO,
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

const getOrder = async (userId: number, token: string): Promise<ApiResponse<OrderDTO>> => {
    try {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }

        const res: Response = await fetch(`${apiPath}/order/get/${userId}`, requestOptions);
        if(!res.ok){
            const error: ApiError = new ApiError(`Error getting favorite items: ${res.status} ${res.statusText}`, res.status);
            throw error;
        }
        return {
            data: await res.json() as OrderDTO,
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

const addItem = async (orderItem: OrderItemDTO, token: string): Promise<ApiResponse<ApiSuccessResponse>> => {
    try {
        const requestHeaders = {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                orderId: orderItem.orderId,
                productId: orderItem.productId,
                quantity: orderItem.quantity,
                price: orderItem.price,
            })
        };

        const res: Response =  await fetch(`${apiPath}/order/addItem`, requestHeaders);
        if(!res.ok){
            const error: ApiError = new ApiError(`Error getting favorite items: ${res.status} ${res.statusText}`, res.status);
            throw error;
        }
        return {
            data: {message: "Order item added successfully"},
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

const getOrderItems = async (orderId: number): Promise<ApiResponse<OrderItemDTO[]>> => {
    try {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }

        const res: Response = await fetch(`${apiPath}/order/getItems/${orderId}`, requestOptions);
        if(!res.ok){
            const error: ApiError = new ApiError(`Error getting favorite items: ${res.status} ${res.statusText}`, res.status);
            throw error;
        }
        return {
            data: await res.json() as OrderItemDTO[],
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

const getOrderItemProducts = async (orderId: number): Promise<ApiResponse<Product[]>> => {
    try {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }

        let res: Response = await fetch(`${apiPath}order/getOrderProduct/${orderId}`, requestOptions);
        if(!res.ok){
            const error: ApiError = new ApiError(`Error getting favorite items: ${res.status} ${res.statusText}`, res.status);
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

export interface OrderItemResponseDTO {
    orderItemId: number,
    orderId: number,
    productId: number,
    productName: string,
    productDescription: string,
    categoryId: number,
    imageURL: string,
    orderedQuantity: number,
    orderedPrice: number,
}

const getOrderItemsWithProduct = async (orderId: number): Promise<ApiResponse<OrderItemResponseDTO[]>> => {
    try{
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        }

        const res: Response = await fetch(`${apiPath}/order/getOrderItemsWithProduct/${orderId}`, requestOptions);
        if(!res.ok) {
            const error = new ApiError(`Error retrieving orderItemsWithProduct ${res.status} ${res.statusText}`, res.status);
            throw error;
            
        } 

        return {
            data: await res.json(),
            error: null 
        }
    } catch(error) {
        if(error instanceof ApiError){
            return {
                data: null,
                error
            }
        } else {
            return {
                data: null,
                error: new ApiError(`Unexpected Error occured`, 500)
            }
        }
    }
}

const deleteItem = async (orderItemId: number): Promise<ApiResponse<ApiSuccessResponse>> => {
    try {
        const requestOptions = {
            method: 'DELETE',
        }

        const res: Response = await fetch(`${apiPath}/order/deleteItem/${orderItemId}`, requestOptions);
        if(!res.ok) {
            const error = new ApiError(`Error deleting order item ${res.status} ${res.statusText}`, res.status);
            throw error;
            
        } 
        return {
            data: { message: 'Deleting order item successful.'},
            error: null 
        }
    } catch(error) {
        if(error instanceof ApiError){
            return {
                data: null,
                error
            }
        } else {
            return {
                data: null,
                error: new ApiError(`Unexpected Error occured`, 500)
            }
        }
    }
}

export { 
    getOrder,
    createOrder, 
    addItem, 
    getOrderItems,
    getOrderItemProducts, 
    getOrderItemsWithProduct,
    deleteItem
 };