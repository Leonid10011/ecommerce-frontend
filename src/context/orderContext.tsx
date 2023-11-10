/**
 * We use this context to handle the BuyOrder data
 */
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getOrderItems, addItem, getOrder, OrderItemDTO, OrderDTO, getOrderItemProducts } from "../api/orderApi";
import { useAuth } from "./authContext";
import { ApiResponse } from "../types/api/apiTypes";
import { Product, useProduct } from "./productContext";


export interface OrderProduct extends Product {
    orderQuantity: number,
    orderPrice: number, 
}


interface OrderContextType {
    initOrderContext: (orderId: number) => void,
    orderItems: OrderItemDTO[],
    resetCart: () => void,
    addOrderItem: (product: OrderItemDTO) => void,
    fetchAndSetOrder: (id: number, token: string) => void,
    filterOrderItems: OrderProduct[],
    order: OrderDTO,
};

const initData = {
    initOrderContext: () => {},
    orderItems: [],
    resetCart: () => {},
    addOrderItem: () => {},
    fetchAndSetOrder: async () => {},
    filterOrderItems: [],
    order: {
        id: 0,
        userId: 0,
        date: new Date(),
        status: "",
    }
}

const orderContext = createContext<OrderContextType>(initData);

const useOrder = () => useContext(orderContext);

const OrderContextProvider = ({children} : {
    children: React.ReactNode
}) => {

    //const { products } = useProduct();
    const [ orderProducts,setOrderProducts ] = useState<Product[]>([]);
    const [ orderItems, setOrderItems ] = useState<OrderItemDTO[]>([]);
    const [ triggerOrderItems, setTriggerOrderItems ] = useState<boolean>(false);

    const [ order, setOrder ] = useState<OrderDTO>({
        id: 0,
        userId: 0,
        date: new Date(),
        status:  ""
    });
    
    const { userId, token, isAuthenticated } = useAuth();


    const filterOrderItems: OrderProduct[] = useMemo(() => {
        console.log("Filer order items")
        try {
            // const orderProducts = products.filter(
            //     item => orderItems.find(item2 => item.id === item2.productId)
            // );
            // if( orderProducts.length != orderItems.length)
            // {
            //     console.log(orderProducts.length, "  ", orderItems.length )
            //     throw new Error("Number of products not equal to number oder OrdeItems, something went wrong.")
            // }
            
            // merge the product and orderItem properties
            const orderProductsMerged: OrderProduct[] = orderProducts.map(
                (orderProduct, index) => {
                    const orderItem = orderItems.find( item2 => item2.productId === orderProduct.id)!;
                    return {
                        id: orderProduct.id,
                        name: orderProduct.name,
                        description: orderProduct.description,
                        imgURL: orderProduct.imgURL,
                        price: orderProduct.price,
                        quantity: orderProduct.quantity,
                        categoryID: orderProduct.categoryID,
                        orderQuantity: orderItem.quantity,
                        orderPrice: orderItem.price,
                    }
                }
            )
            console.log("Merged: ", orderProductsMerged);
            return orderProductsMerged;

        } catch (error){
            console.error(`Not able to filter Products: ${error}`);
            throw error;
        }

    }, [triggerOrderItems]);

    const fetchAndSetOrder = async () => {
        const resOrder: ApiResponse<OrderDTO> = await getOrder(userId, token);
        const newOrder = {
            ...resOrder.data
        }
        setOrder(newOrder);

        return newOrder.id
    }

    const fetchAndSetOrderItems = async (orderId: number) => {
        let resOrderItems: ApiResponse<OrderItemDTO[]> = await getOrderItems(orderId);
        console.log("ORderitems: ", resOrderItems)
        setOrderItems([...resOrderItems.data]);
    }

    const fetchAndSetOrderProducts = async (orderId: number) => {
        let resOrderItems: ApiResponse<Product[]> = await getOrderItemProducts(orderId);
        console.log("ORderitems: ", resOrderItems)
        setOrderProducts([...resOrderItems.data]);
    }

    /**
     * @description Set the orderId for global acces though context and fetch corresponding orderItems for cart
     * @param orderId 
     */
    const initOrderContext = async () => {
        let orderId = await fetchAndSetOrder();
        await fetchAndSetOrderProducts(orderId);
        await fetchAndSetOrderItems(orderId);
        setTriggerOrderItems(prev => !prev);
    }
    
    /**
     * @description When logged off, clean the carts content for client view
     */
    const resetCart = () => {
        setOrderItems([]);
    }

    /**
     * Add an OrderItem. This will be shown in the cart
     * @param product 
     * @param token 
     */
    const addOrderItem = async (product: OrderItemDTO) => {    
        const resOrderItem = await addItem(product, token);
        setOrderItems([...orderItems, resOrderItem.data]); 
    }

    useEffect(() => {
        if(isAuthenticated){
            initOrderContext();
        }
    }, [userId])

    return(
        <orderContext.Provider value={{initOrderContext, orderItems, resetCart, addOrderItem, fetchAndSetOrder, filterOrderItems, order}}>
            {children}
        </orderContext.Provider>
    )
}

export { OrderContextProvider, useOrder}