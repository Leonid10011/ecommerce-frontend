import { useEffect, useState } from "react"
import { OrderItemResponseDTO, addItem, deleteItem, getOrder, getOrderItemsWithProduct } from "../api/orderApi"
import { ApiResponse, ApiSuccessResponse } from "../types/ApiInterfaces";
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

const useOrderApi = (token: string) => {
    const [order, setOrder] = useState<OrderDTO | null>(null);
    const [orderProducts, setOrderProducts] = useState<OrderItemResponseDTO[]>([]);
    const [orderItems, setOrderItems] = useState<OrderItemRequestDTO[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    /**
     * Attempts to get order of user 
     * @returns 
     */
    const fetchAndSetOrder = async (userId:number) => {
        setLoading(true);
        const response: ApiResponse<OrderDTO> = await getOrder(userId, token);
        setLoading(false);
        console.log("Order log: ", response.data);
        if(response.data){
            setOrder(prev => response.data);
            console.log("Order test: ", order);
        } else if (response.error) {
            setError(new Error('Could not get order for provided userId and token.'))
        } else {
            console.error("Should not happen.")
        }
    }

    /**
     * Attempts to get orderItemsWithProducts by calling api
     * @returns void
     */
    const fetchAndSetOrderProducts = async () => {
        setLoading(true);
        if(!order){
            console.log("Order not set");
            setLoading(false)
            return;
        }
        const response: ApiResponse<OrderItemResponseDTO[]> = await getOrderItemsWithProduct(order.id);
        setLoading(false);
        if(response.data){
            setOrderProducts([...response.data])
        } else if(response.error){
            setError(new Error("Could not get OrderProducts"));
        } else {
            setError(new Error("Unexpected error occurred"));
        }
    }

    /**
     * Add an OrderItem. This will be shown in the cart
     * @param product 
     * @param token 
     */
    const addOrderItem = async (product: OrderItemRequestDTO) => {    
        setLoading(true);
        const response: ApiResponse<ApiSuccessResponse> = await addItem(product, token);
        setLoading(false);
        if(response.data){
            // refetch order products
            fetchAndSetOrderProducts();
            toast.success('Added Product to Cart.', {
                position: 'top-left',
            })
        }

    }

    const deleteOrderItem = async (orderItemId: number) => {
        setLoading(true);
        const response: ApiResponse<ApiSuccessResponse> = await deleteItem(orderItemId);
        setLoading(false);
        // Remove order product from current orderProducts
        setOrderProducts(orderProducts.filter(item => item.orderItemId !== orderItemId));
        if(!response.data)
            toast.error('Could not remove Product from Cart.', {
        position: 'top-left'});
    }

    /**
     * @description When logged off, clean the carts content for client view
     */
    const resetCart = () => {
        setOrderProducts([]);
        setOrder(null);
    }

    // Fetch orderProducts when the order is changed.
    useEffect(() => {
        if(order){
            fetchAndSetOrderProducts();
        }
    }, [order])

    return { order, orderProducts, fetchAndSetOrder, fetchAndSetOrderProducts, addOrderItem, deleteOrderItem, resetCart }
}

export default useOrderApi;