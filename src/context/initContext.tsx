/**
 * We us this context to init the other Contexts with token and userId
 */
import { OrderType, useAuth } from "./authContext";
import { createFavoriteItem, deleteFavoriteProductByUserAndProduct, getOrder } from "../api/dataApi";
import { createContext, useContext, useEffect } from "react";
import { Product, useData } from "./dataContext";
import { OrderItemType, useOrder } from "./orderContext";

const initData = {
    initLogin: () => {},
    test: () => {},
    doSearch: () => {},
    doFavorite: () => {},
    doOrder: () => {}
};

interface InitContextType {
    initLogin: (name: string, password: string) => void;
    test: () => void,
    doSearch: (searchTerm: string) => void,
    doFavorite: (product: Product) => void,
    doOrder: (orderItem: OrderItemType) => void
}

export const initContext = createContext<InitContextType>(initData);

export const useInit = () => useContext(initContext); 

export const InitContextProvider = ({children}:{
    children: React.ReactNode
}) => {

    const {token, fetchAndSetToken, userId } = useAuth();
    const { initFavoriteItems, fetchAndSetProductsByName } = useData();
    const { initOrderContext, addOrderItem, orderId } = useOrder();

    const initLogin = async (name: string, password: string) => {

        const {id, token} = await fetchAndSetToken(name, password);
        console.log("userId: ", id, " sec ", userId)
        initFavoriteItems(id, token);
        
        const userOrder: OrderType  = await getOrder(id, token);
        initOrderContext(userOrder.id)
    }
    
    const doSearch = (searchTerm: string) => {
        if(searchTerm !== "")
            fetchAndSetProductsByName(searchTerm, userId, token)
    }

    const test = () => {
        console.log("USERID ", userId);
    }

    const doFavorite = (product: Product) => {
        if(product.isFavorite){
            deleteFavoriteProductByUserAndProduct(userId, product.id, token);
        } else {
            createFavoriteItem(userId, product.id, token);
        }
        initFavoriteItems(userId, token);
    }

    const doOrder = (orderItem: OrderItemType) => {
        addOrderItem(orderItem, token);
        initOrderContext(orderId);
    }

    useEffect(() => {
        console.log("Init doFavorite");
    }, []);

    return (
        <initContext.Provider value={{initLogin, test, doSearch, doFavorite, doOrder}}>
            {children}
        </initContext.Provider>
    )
}