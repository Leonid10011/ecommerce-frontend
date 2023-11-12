import { useEffect, useState } from "react"
import { OrderDTO, OrderItemResponseDTO, getOrder, getOrderItemsWithProduct } from "../api/orderApi"
import { ApiResponse } from "../types/ApiInterfaces";

const useOrderApi = () => {
    const [order, setOrder] = useState<OrderDTO | null>(null);
    const [orderProducts, setOrderProducts] = useState<OrderItemResponseDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    /**
     * Attempts to get order of user 
     * @returns 
     */
    const fetchAndSetOrder = async (userId:number, token: string) => {
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

    // Fetch orderProducts when the order is changed.
    useEffect(() => {
        if(order)
            fetchAndSetOrderProducts();
    }, [order])

    return { orderProducts, fetchAndSetOrder, fetchAndSetOrderProducts }
}

export default useOrderApi;