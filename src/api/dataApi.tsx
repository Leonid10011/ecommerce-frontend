import {config} from "../config";
import { ApiResponse } from "../types/api/apiTypes";

const api_path = config.api_path;
const apiPath = config.api_path;

const getOrder = async (userId: number, token: string) => {
    console.log("Get Order Debug");
    try {
        console.log("ORDer token: ", token)
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }

        let res = await fetch(api_path + "/order/get/" + userId, requestOptions);
        console.log("getOrder res: ", res);
        if(res.ok){
            let data = res.json();
            return data;

        }

        return null

    } catch( err: any){
        console.error("ERROR");
        return null;
    }
}

const createOrder = async (userId: number, date: Date, status: string) => {
    console.log("Create Order Debug");
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

        let res = await fetch(api_path + "/order/create", requestOptions);
        
        console.log(res);

        return true;
    } catch( err: any) {
        return false;
    }
}

const addItem = async (orderItemDTO: {
    orderId: number,
    productId: number,
    quantity: number,
    price: number
}, token: string) => {
    console.log("Add Item Debug");
    console.log("DA", orderItemDTO.productId)
    try {
        const requestHeaders = {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                orderId: orderItemDTO.orderId,
                productId: orderItemDTO.productId,
                quantity: orderItemDTO.quantity,
                price: orderItemDTO.price
            })
        };

        let res =  await fetch(api_path + '/order/addItem', requestHeaders);
        let data = res;

        console.log(data);
        return true;
    } catch(err: any) {
        return false
    }
}


const getOrderItems = async (orderId: number) => {
    console.log("Get Order Items Debug");
    try {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }

        let res = await fetch(api_path + '/order/getItems/' + orderId, requestOptions);
        let data = res.json();
        
        return data;
    } catch(err: any) {
        console.error("Error get Items", err);
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

        let res = await fetch(api_path + '/order/getOrderProduct/' + orderId, requestOptions);
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