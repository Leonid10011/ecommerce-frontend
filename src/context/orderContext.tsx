import React, { createContext, useContext, useState } from "react";
import { Product } from "./dataContext";
import { getItems } from "../api/dataApi";

interface OrderContextType {
    initOrderContext: (orderId: number) => void,
    items: Product[]
}

const initData = {
    initOrderContext: () => {},
    items: []
}

const orderContext = createContext<OrderContextType>(initData);

const useOrder = () => useContext(orderContext);

const OrderContextProvider = ({children} : {
    children: React.ReactNode
}) => {

    const [ items, setItems ] = useState<Product[]>([]);

    const fetchAndSetItems = async (orderId: number) => {
        let data = await getItems(orderId);
        setItems(data);
    }

    const initOrderContext = (orderId: number) => {
        fetchAndSetItems(orderId);
    }

    return(
        <orderContext.Provider value={{initOrderContext, items}}>
            {children}
        </orderContext.Provider>
    )
}

export { OrderContextProvider, useOrder}