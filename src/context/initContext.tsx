/**
 * We us this context to init the other Contexts with token and userId
 */
import { OrderType, useAuth } from "./authContext";
import { createFavoriteItem, deleteFavoriteProductByUserAndProduct, getOrder } from "../api/dataApi";
import { createContext, useContext, useEffect } from "react";
import { Product, useData } from "./productContext";
import { OrderItemType, useOrder } from "./orderContext";

const initData = {
    initLogin: () => {},
    test: () => {},
    doSearch: () => {},
    doFavorite: () => {},
    doOrder: () => {},
    doOrderRefresh: () => {}
};

interface InitContextType {
    initLogin: (name: string, password: string) => void;
    test: () => void,
    doSearch: (searchTerm: string) => void,
    doFavorite: (product: Product) => void,
    doOrder: (orderItem: OrderItemType) => void,
    doOrderRefresh: () => void
}

export const initContext = createContext<InitContextType>(initData);

export const useInit = () => useContext(initContext); 

export const InitContextProvider = ({children}:{
    children: React.ReactNode
}) => {

    const {token, fetchAndSetToken, userId } = useAuth();
    const { fetchAndSetProductsByName } = useData();
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
    
    const doSearch = (searchTerm: string) => {
        if(searchTerm !== "")
            fetchAndSetProductsByName(searchTerm, userId, token)
    }

    const test = () => {
        console.log("USERID ", userId);
    }
    /**
     * @description Handle favoriteItems in the component
     * @param product 
     */
    const doFavorite = (product: Product) => {
        if(product.isFavorite){
            deleteFavoriteProductByUserAndProduct(userId, product.id, token);
        } else {
            createFavoriteItem(userId, product.id, token);
        }
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
        <initContext.Provider value={{initLogin, test, doSearch, doFavorite, doOrder, doOrderRefresh}}>
            {children}
        </initContext.Provider>
    )
}