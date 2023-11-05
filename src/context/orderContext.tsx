/**
 * We use this context to handle the BuyOrder data
 */
import React, { createContext, useContext, useState } from "react";
import { Product } from "./dataContext";
import { getOrderItems, getOrderItemProducts, addItem } from "../api/dataApi";

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
};

const initData = {
    initOrderContext: () => {},
    orderItems: [],
    resetCart: () => {},
    addOrderItem: () => {},
    orderId: 0
};

const orderContext = createContext<OrderContextType>(initData);

const useOrder = () => useContext(orderContext);

const OrderContextProvider = ({children} : {
    children: React.ReactNode
}) => {

    const [ orderItems, setOrderItems ] = useState<OrderProductType[]>([]);
    const [ orderId, setOrderId ] = useState<number>(0);

    const fetchAndSetItems = async (orderId: number) => {
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

    const initOrderContext = (orderId: number) => {
        console.log("Init Order Context");
        setOrderId(orderId);
        fetchAndSetItems(orderId);
    }

    const resetCart = () => {
        setOrderItems([]);
    }

    const addOrderItem = async (product: OrderItemType, token: string) => {
        try {
            let res = await addItem(product, token);
            if(res === true){
                console.log("Added item")
            } else {
                console.log("Failed adding item.")
            }
        } catch( err: any){
            console.error(err);
        }
    }

    return(
        <orderContext.Provider value={{initOrderContext, orderItems, resetCart, addOrderItem, orderId}}>
            {children}
        </orderContext.Provider>
    )
}

export { OrderContextProvider, useOrder}