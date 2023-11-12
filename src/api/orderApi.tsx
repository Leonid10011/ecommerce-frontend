import {config} from "../config";
import { OrderProduct } from "../../misc/orderContext";
import { ApiResponse, ApiSuccessResponse } from "../types/ApiInterfaces";
import { ApiError } from "../types/ErrorTypes";
import { Product } from "./productApi";
import { AcceptEnum, apiRequest } from "./apiRequest";

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

interface CreateOrderBody {
    userId: number,
    date: Date,
    status: string
}

const createOrder = async (userId: number, date: Date, status: string): Promise<ApiResponse<OrderDTO>> => {
    const url = `${apiPath}order/create`;
    const body: CreateOrderBody = {
        userId: userId,
        date: date,
        status: status
    }
    return apiRequest(url, 'POST', body, undefined, AcceptEnum.json);
}

const getOrder = async (userId: number, token: string): Promise<ApiResponse<OrderDTO>> => {
    const url = `${apiPath}/order/get/${userId}`;
    return apiRequest(url, 'GET', undefined, token, AcceptEnum.json);
}

interface AddItemBody {
    orderId: number,
    productId: number,
    quantity: number,
    price: number
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