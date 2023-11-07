/**
 * We us this context to init the other Contexts with token and userId
 */
import { OrderType, useAuth } from "./authContext";
import { createContext, useContext, useEffect } from "react";
import { useProduct } from "./productContext";
import { OrderItemType, useOrder } from "./orderContext";

const initData = {
    initLogin: () => {},
    test: () => {},
    doSearch: () => {},
    doOrder: () => {},
    doOrderRefresh: () => {}
};

interface InitContextType {
    initLogin: (name: string, password: string) => void;
    test: () => void,
    doSearch: (searchTerm: string) => void,
    doOrder: (orderItem: OrderItemType) => void,
    doOrderRefresh: () => void
}

export const initContext = createContext<InitContextType>(initData);

export const useInit = () => useContext(initContext); 

export const InitContextProvider = ({children}:{
    children: React.ReactNode
}) => {

    const {token, fetchAndSetToken, userId } = useAuth();
    const { fetchAndSetProductsByName } = useProduct();
    const { initOrderContext, addOrderItem, orderId, fetchAndSetOrder } = useOrder();

    /**
     * @description Init everything that needs to be done when logged in
     * @param name 
     * @param password 
     */
    const initLogin = async (name: string, password: string) => {

        const {id, token} = await fetchAndSetToken(name, password);
        console.log("userId: ", id, " sec ", userId, "token: ", token, " END")
        
        const userOrder: OrderType = await fetchAndSetOrder(id, token);
        console.log("UserOrder, ", userOrder);
        if(userOrder != null)
            initOrderContext(userOrder.id)
    }
    //////############################
    const doSearch = (searchTerm: string) => {
        if(searchTerm !== "")
            fetchAndSetProductsByName(searchTerm)
    }

    const test = () => {
        console.log("USERID ", userId);
    }
    
    /**
     * @description Handle order functionality in the component
     * @param orderItem 
     */
    const doOrder = (orderItem: OrderItemType) => {
        addOrderItem(orderItem, token);
        initOrderContext(orderId);
    }
    /**
     * @description refresh the orderItems, so we can isntantly see them in cart  
     */ 
    const doOrderRefresh = () => {
        initOrderContext(orderId);
    }

    useEffect(() => {
        // Just for debugging
        console.log("Init doFavorite");
    }, []);

    return (
        <initContext.Provider value={{initLogin, test, doSearch, doOrder, doOrderRefresh}}>
            {children}
        </initContext.Provider>
    )
}