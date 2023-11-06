/**
 * We use this context to handle the BuyOrder data
 */
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Product } from "./dataContext";
import { getOrderItems, getOrderItemProducts, addItem, getOrder } from "../api/dataApi";
import { OrderType } from "./authContext";

export interface OrderProductType {
    id: number,
    name: string,
    description: string,
    imageURL: string,
    categoryId: number,
    quantity: number,
    price: number
};

export interface OrderItemType {
    orderId: number,
    productId: number,
    quantity: number,
    price: number,
}

interface OrderContextType {
    initOrderContext: (orderId: number) => void,
    orderItems: OrderProductType[],
    resetCart: () => void,
    addOrderItem: (product: OrderItemType, token: string) => void,
    orderId: number,
    fetchAndSetOrder: (id: number, token: string) => Promise<OrderType>
};

const initData = {
    initOrderContext: () => {},
    orderItems: [],
    resetCart: () => {},
    addOrderItem: () => {},
    orderId: 0,
    fetchAndSetOrder: async () => { return {
        id: 0,
        userId: 0,
        date: new Date(),
        status:  ""
    }}
}

const orderContext = createContext<OrderContextType>(initData);

const useOrder = () => useContext(orderContext);

const OrderContextProvider = ({children} : {
    children: React.ReactNode
}) => {

    const [ orderItems, setOrderItems ] = useState<OrderProductType[]>([]);
    const [ orderId, setOrderId ] = useState<number>(0);
    const [ order, setOrder ] = useState<OrderType>();
    const rerenderRef = useRef(false);
    /**
     * Fetch the OrderItem and the corresponding Product and then 
     * combine them into an OrderProduct to have access to all information from both
     * @param orderId 
     * @returns 
     */
    const fetchAndSetItems = async (orderId: number) => {
        // as we initialize id with 0, we want to avoid working on it
        if(orderId <= 0)
            return false;
        console.log("DATA orericontext")
        try {
            let data: OrderItemType[] = await getOrderItems(orderId);
            
            let data2: Product[] = await getOrderItemProducts(orderId);
            
            const result: OrderProductType[] = data.map((item, index) => ({
                id: data2[index].id,
                name: data2[index].name,
                description: data2[index].description,
                imageURL: data2[index].imgURL,
                categoryId: data2[index].categoryID,
                quantity: item.quantity,
                price: item.price
              }));
            
            setOrderItems(result);
        }catch( err: any) {
            setOrderItems([]);
        }
    }
    /**
     * Fetch  the order of the user and return in, to use it imediatly
     * @param id 
     * @param token 
     * @returns 
     */
    const fetchAndSetOrder = async (id: number, token: string) => {
        let resOrder = await getOrder(id, token);
        setOrder(resOrder);

        return resOrder;
    }
    /**
     * Set the orderId for global acces though context and fetch corresponding orderItems for cart
     * @param orderId 
     */
    const initOrderContext = (orderId: number) => {
        console.log("Init Order Context");
        setOrderId(orderId);
        fetchAndSetItems(orderId);
        reRender();
    }

    useEffect(() => {
        if(rerenderRef.current){
            rerenderRef.current = false;
        }
    }, [rerenderRef])

    const resetCart = () => {
        setOrderItems([]);
    }

    /**
     * Add an OrderItem. This will be shown in the cart
     * @param product 
     * @param token 
     */
    const addOrderItem = async (product: OrderItemType, token: string) => {
        try {
            let res = await addItem(product, token);
            if(res === true){
                // refetch the items with the added Item
                fetchAndSetItems(orderId);
                console.log("Added item")
            } else {
                console.log("Failed adding item.")
            }
        } catch( err: any){
            console.error(err);
        }
    }
    /**
     * Rerender to updated the state for rendering most recent items
     */
    const reRender = () => {
        rerenderRef.current = true;
    }

    return(
        <orderContext.Provider value={{initOrderContext, orderItems, resetCart, addOrderItem, orderId, fetchAndSetOrder}}>
            {children}
        </orderContext.Provider>
    )
}

export { OrderContextProvider, useOrder}