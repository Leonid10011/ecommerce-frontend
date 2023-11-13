import { useEffect, useState } from "react"
import { addItem, deleteItem, getOrder, getOrderItemsWithProduct } from "../api/orderApi"
import { ApiResponse, ApiSuccessResponse, OrderItemResponseDTO } from "../types/ApiInterfaces";
import { toast } from "react-toastify";

export interface OrderDTO {
    id: number,
    userId: number,
    date: Date,
    status: string,
}

export interface OrderItemRequestDTO {
    id: number,
    orderId: number,
    productId: number,
    quantity: number,
    price: number,
}

/**
 * Custom hook for managing orders and order items.
 * 
 * @param token - Authentication token used for API requests.
 */
const useOrderApi = (token: string) => {
    const [order, setOrder] = useState<OrderDTO | null>(null);
    const [orderProducts, setOrderProducts] = useState<OrderItemResponseDTO[]>([]);
    const [orderItems, setOrderItems] = useState<OrderItemRequestDTO[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    /**
     * Fetches the user's order based on the user ID and sets it in state.
     * 
     * @param userId - The ID of the user whose order is to be fetched.
     * @returns A promise that resolves to void.
     */
    const fetchAndSetOrder = async (userId: number) => {
        setLoading(true);
        const response: ApiResponse<OrderDTO> = await getOrder(userId, token);
        setLoading(false);
        if (response.data) {
            setOrder(response.data);
        } else if (response.error) {
            setError(new Error('Could not get order for provided userId and token.'));
        } else {
            console.error("Unexpected condition in fetchAndSetOrder.");
        }
    };

    /**
     * Fetches and sets the order items with product details for the current order.
     */
    const fetchAndSetOrderProducts = async () => {
        setLoading(true);
        if (!order) {
            console.log("Order not set");
            setLoading(false);
            return;
        }
        const response: ApiResponse<OrderItemResponseDTO[]> = await getOrderItemsWithProduct(order.id);
        setLoading(false);
        if (response.data) {
            setOrderProducts(response.data);
        } else if (response.error) {
            setError(new Error("Could not get OrderProducts"));
        } else {
            setError(new Error("Unexpected error occurred in fetchAndSetOrderProducts"));
        }
    };

    /**
     * Adds an item to the order and updates the order products.
     * 
     * @param product - The product details to be added to the order.
     */
    const addOrderItem = async (product: OrderItemRequestDTO) => {    
        setLoading(true);
        const response: ApiResponse<ApiSuccessResponse> = await addItem(product, token);
        setLoading(false);
        if (response.data) {
            fetchAndSetOrderProducts();
            toast.success('Added Product to Cart.', { position: 'top-left' });
        }
    };

    /**
     * Deletes an item from the order and updates the order products.
     * 
     * @param orderItemId - The ID of the order item to be deleted.
     */
    const deleteOrderItem = async (orderItemId: number) => {
        setLoading(true);
        const response: ApiResponse<ApiSuccessResponse> = await deleteItem(orderItemId);
        setLoading(false);
        setOrderProducts(orderProducts.filter(item => item.orderItemId !== orderItemId));
        if (!response.data) {
            toast.error('Could not remove Product from Cart.', { position: 'top-left' });
        }
    };

    /**
     * Resets the cart by clearing the order and order products from the state.
     */
    const resetCart = () => {
        setOrderProducts([]);
        setOrder(null);
    };

    useEffect(() => {
        if (order) {
            fetchAndSetOrderProducts();
        }
    }, [order]);

    return { order, orderProducts, fetchAndSetOrder, fetchAndSetOrderProducts, addOrderItem, deleteOrderItem, resetCart };
};

export default useOrderApi;
