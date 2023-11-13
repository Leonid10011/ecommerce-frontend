import {config} from "../config";
import { ApiResponse, ApiSuccessResponse, Order, OrderItemDTO, OrderItemResponseDTO, Product } from "../types/ApiInterfaces";
import { AcceptEnum, apiRequest } from "./apiRequest";
import { AddItemBody, CreateOrderBody } from "../types/RequestBodyInterfaces";
// Api url stored in config file
const apiPath = config.api_path;
/**
 * Creates a new order for a user.
 * 
 * @param {number} userId - The ID of the user for whom the order is being created.
 * @param {Date} date - The date when the order is created.
 * @param {string} status - The status of the order (e.g., 'pending', 'completed').
 * @returns {Promise<ApiResponse<Order>>} A promise that resolves to the newly created order.
 */
const createOrder = async (userId: number, date: Date, status: string): Promise<ApiResponse<Order>> => {
    const url = `${apiPath}order/create`;
    const body: CreateOrderBody = {
        userId: userId,
        date: date,
        status: status
    }
    return apiRequest(url, 'POST', body, undefined, AcceptEnum.json);
}
/**
 * Retrieves an order for a given user.
 * 
 * @param {number} userId - The ID of the user whose order is being retrieved.
 * @param {string} token - The authentication token for API access.
 * @returns {Promise<ApiResponse<Order>>} A promise that resolves to the user's order.
 */
const getOrder = async (userId: number, token: string): Promise<ApiResponse<Order>> => {
    const url = `${apiPath}/order/get/${userId}`;
    return apiRequest(url, 'GET', undefined, token, AcceptEnum.json);
}
/**
 * Adds an item to an order.
 * 
 * @param {OrderItemDTO} orderItem - The order item to be added.
 * @param {string} token - The authentication token for API access.
 * @returns {Promise<ApiResponse<ApiSuccessResponse>>} A promise indicating the success or failure of the operation.
 */
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
/**
 * Adds an item to an order.
 * 
 * @param {number} orderId - The ID of order whose order items are being retrieved.
 * @returns {Promise<ApiResponse<OrderItemDTO[]>>} A promise that resolves to the order items being retrieved.
 */
const getOrderItems = async (orderId: number): Promise<ApiResponse<OrderItemDTO[]>> => {
    const url = `${apiPath}/order/getItems/${orderId}`;
    return apiRequest(url, 'GET', undefined, undefined, AcceptEnum.json);
}
/**
 * Gets products belonging to the order item.
 * 
 * @param {number} orderId - The ID of the order that the products belong to.
 * @returns {Promise<ApiResponse<Product[]>>} A promise that resolves to the products that are being retrieved.
 */
const getOrderItemProducts = async (orderId: number): Promise<ApiResponse<Product[]>> => {
    const url = `${apiPath}order/getOrderProduct/${orderId}`;
    return apiRequest(url, 'GET', undefined, undefined, AcceptEnum.json);
}
/**
 * Gets order items merged with product on the product id.
 * 
 * @param {number} orderId - The ID of the order that the products belong to.
 * @returns {Promise<ApiResponse<Product[]>>} A promise that resolves to the order item products that are being retrieved.
 */
const getOrderItemsWithProduct = async (orderId: number): Promise<ApiResponse<OrderItemResponseDTO[]>> => {
    const url = `${apiPath}/order/getOrderItemsWithProduct/${orderId}`;
    return apiRequest(url, 'GET', undefined, undefined, AcceptEnum.json);
}
/**
 * Deletes the order item by its ID.
 * 
 * @param {number} orderItemId - The ID of the order item to be deleted.
 * @returns {Promise<ApiResponse<ApiSuccessResponse>>} A promise indicating the success or failure of the operation.
 */
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