import {config} from "../config";
import { ApiResponse } from "../types/api/apiTypes";

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
        if(res.status === 201){
            const data: OrderDTO = await res.json() as OrderDTO;
            return {
                data,
                status: res.status,
            };
        } else {
            throw new Error(`HTTP Error with status ${res.status}`);
        }
    } catch( error) {
        console.error(`Error creating Order: ${error}`);
        throw error;
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
        if(res.ok){
            const data: OrderDTO = await res.json() as OrderDTO;
            return {
                data,
                status: res.status,
            }
        } else {
            throw new Error(`HTTP Error with status code: ${res.status}`);
        };
    } catch( error){
        console.error(`Error getting Order ${error}`);
        throw error;
    }
}

const addItem = async (orderItem: OrderItemDTO, token: string): Promise<ApiResponse<OrderItemDTO>> => {
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
        if(res.status === 201 || res.ok){
            const data: OrderItemDTO = await res.json() as OrderItemDTO;
            return {
                data,
                status: res.status,
            };
        } else {
            throw new Error(`HTTP Error with status code: ${res.status}`);
        };
    } catch(error) {
        console.error(`Error adding OrderItem ${error}`);
        throw error;
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
        if(res.ok){
            const data:OrderItemDTO[] = await res.json() as OrderItemDTO[];  
            return {
                data,
                status: res.status,
            }
        } else {
            throw new Error(`HTTP Error with status code: ${res.status}`);
        }
    } catch(error) {
        console.error(`Error get Items ${error}`);
        throw error;
    }
}

const getOrderItemProducts = async (orderId: number) => {
    console.log("Get Order Item Products Debug");
    try {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }

        let res = await fetch(`${apiPath}order/getOrderProduct/${orderId}`, requestOptions);
        let data = res.json();
        
        return data;
    } catch(err: any) {
        console.error("Error get Items", err);
    }
} 

export { 
    getOrder,
    createOrder, 
    addItem, 
    getOrderItems,
    getOrderItemProducts, 
 };