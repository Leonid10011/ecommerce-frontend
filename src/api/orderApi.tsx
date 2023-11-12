import {config} from "../config";
import { ApiResponse, ApiSuccessResponse, Order, OrderItemDTO, OrderItemResponseDTO, Product } from "../types/ApiInterfaces";
import { AcceptEnum, apiRequest } from "./apiRequest";
import { AddItemBody, CreateOrderBody } from "../types/RequestBodyInterfaces";

const apiPath = config.api_path;

const createOrder = async (userId: number, date: Date, status: string): Promise<ApiResponse<Order>> => {
    const url = `${apiPath}order/create`;
    const body: CreateOrderBody = {
        userId: userId,
        date: date,
        status: status
    }
    return apiRequest(url, 'POST', body, undefined, AcceptEnum.json);
}

const getOrder = async (userId: number, token: string): Promise<ApiResponse<Order>> => {
    const url = `${apiPath}/order/get/${userId}`;
    return apiRequest(url, 'GET', undefined, token, AcceptEnum.json);
}

const addItem = async (orderItem: OrderItemDTO, token: string): Promise<ApiResponse<ApiSuccessResponse>> => {
    const url = `${apiPath}/order/addItem`;
    const body: AddItemBody = {
        orderId: orderItem.orderId,
        productId: orderItem.productId,
        quantity: orderItem.quantity,
        price: orderItem.price,
    };
    return apiRequest(url, 'POST', body, token, AcceptEnum.json);
}

const getOrderItems = async (orderId: number): Promise<ApiResponse<OrderItemDTO[]>> => {
    const url = `${apiPath}/order/getItems/${orderId}`;
    return apiRequest(url, 'GET', undefined, undefined, AcceptEnum.json);
}

const getOrderItemProducts = async (orderId: number): Promise<ApiResponse<Product[]>> => {
    const url = `${apiPath}order/getOrderProduct/${orderId}`;
    return apiRequest(url, 'GET', undefined, undefined, AcceptEnum.json);
}

const getOrderItemsWithProduct = async (orderId: number): Promise<ApiResponse<OrderItemResponseDTO[]>> => {
    const url = `${apiPath}/order/getOrderItemsWithProduct/${orderId}`;
    return apiRequest(url, 'GET', undefined, undefined, AcceptEnum.json);
}

const deleteItem = async (orderItemId: number): Promise<ApiResponse<ApiSuccessResponse>> => {
    const url = `${apiPath}/order/deleteItem/${orderItemId}`;
    return apiRequest(url, 'DELETE', undefined, undefined, undefined);
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