/**
 * We use this Context to retrieve Product realted data 
 */
import React, { createContext, useContext, useEffect, useState } from "react";
import { getFavoriteProductsByUser, getProducts, getProductsByName } from "../api/dataApi";

export interface Product {
    id: number,
    name: string,
    description: string,
    price: number,
    categoryID: number,
    quantity: number,
    imageURL: "https://cdn.pixabay.com/photo/2022/08/28/01/32/dreaming-7415565_640.jpg",
    isFavorite: boolean,
}

const initData = {
    products: [],
    fetchAndSetProductsByName: () => {},
    initFavoriteItems: () => {}

}
interface DataContextType {
    products: Product[],
    fetchAndSetProductsByName: (name: string, userId: number, token:string) => void;
    initFavoriteItems: (userId: number, token:string) => void;
}

const DataContext = createContext<DataContextType>(initData);

const useData = () => useContext(DataContext);

const DataContextProvider = ({children}: {
    children: React.ReactNode
}) => {

    const [products, setProducts] = useState<Product[]>([]);
    /**
     * @description Get favorite products and set "isFavorit" of all fav products to true
     * @param products 
     * @param userId 
     * @param token 
     */
    const filterFavorites = async (products: Product[], userId: number, token: string) => {
        // if we have a logged in User
        if(userId != 0) {
            const { data } = await getFavoriteProductsByUser(userId, token);
            if(data !== null){
                let tmpProducts: Product[] = [];
        
                if(products.length > 0 && data.length > 0){
                    tmpProducts = products.map((product, index) => {return {
                        ...product,
                        isFavorite:  data.some(fav => fav.id === product.id) ? true : false
                    }})
                }
                // if no favProducts, then simply set to products
                setProducts(tmpProducts);
            }
        }
        // If no logged in, keep all products
        else {
            setProducts(products);
        }
    }

    /**
     * @description use searchtag name to only get products containing that term. 
     * filterFAvorite will only affect if there are any favorite items.
     * if the user is not present, then favorites won't take an effect.
     * @param name 
     * @param userId 
     * @param token 
     */
    const fetchAndSetProductsByName = async (name: string, userId: number, token: string) => {
        console.log("Fetch by Name; dataContext");
        try {
            let data: Product[] = await getProductsByName(name);
            filterFavorites(data, userId, token);
        } catch( err: any){
        }
    }

    /**
     * User the userId and Token to initilize the favorite items, which will take effect when logged in.
     * @param userId 
     * @param token 
     */
    const initFavoriteItems = async (userId: number, token: string) => {
        let data = await getProducts();
        filterFavorites(data, userId, token);
    }
    /**
     * Simple Product initializiation at app start
     */
    const initProducts = async() => {
        let data = await getProducts();
        setProducts(data);
    }

    useEffect(() => {
        initProducts();
    }, [])

    return (
        <DataContext.Provider value={{products, fetchAndSetProductsByName, initFavoriteItems}}>
            {children}
        </DataContext.Provider>
    )
}

export { DataContextProvider, useData }