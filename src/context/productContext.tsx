/**
 * We use this Context to retrieve Product realted data 
 */
import React, { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { FavoriteProductDTO, createFavoriteItem, deleteFavoriteProductByUserAndProduct, getFavoriteItemsByUser, getProducts, getProductsByName } from "../api/dataApi";
import { useAuth } from "./authContext";

export interface Product {
    id: number,
    name: string,
    description: string,
    price: number,
    categoryID: number,
    quantity: number,
    imgURL: string,
    isFavorite: boolean,
}

const initData = {
    products: [],
    fetchAndSetProductsByName: () => {},
    filterFavoriteItems: { favoriteItemsFiltered: [] as Product[], nonFavoriteItems: [] as Product[] },
    addFavoriteItem: () => {},
    deleteFavoriteItem: () => {},

}
interface DataContextType {
    products: Product[],
    fetchAndSetProductsByName: (name: string, userId: number, token:string) => void,
    filterFavoriteItems: { favoriteItemsFiltered: Product[], nonFavoriteItems: Product[] },
    addFavoriteItem: (productId: number) => void,
    deleteFavoriteItem: (productId: number) => void, 
}

const DataContext = createContext<DataContextType>(initData);

const useData = () => useContext(DataContext);

const DataContextProvider = ({children}: {
    children: React.ReactNode
}) => {

    const [products, setProducts] = useState<Product[]>([]);
    const [favoriteItems, setFavoriteItems] = useState<FavoriteProductDTO[]>([]);
    const { userId, token, isAuthenticated } = useAuth();
    
    /**
     * 1. fetch favoriteItems
     * 2. filter Products by favrotieItems and return (memo) 
     * 3. post newFavoriItem: 
     *      a. refetch Items
     */
    /**
     * @description Fetch FavoriteItems by userId
     * @param userId: number
     */
    const fetchFavoriteItems = async (userId: number) => {
        const favoriteItems = await getFavoriteItemsByUser(userId);
        if(favoriteItems.status === 200){
            setFavoriteItems(favoriteItems.data);
        }
    }
    /**
     * filter products into favorites and nonFavorites
     */
    const filterFavoriteItems: {
        favoriteItemsFiltered: Product[];
        nonFavoriteItems: Product[];
    } = useMemo(() => {
        const [favoriteItemsFiltered, nonFavoriteItems] = products.reduce<[Product[], Product[]]>(
            ([favorites, nonFavorites], item) => {
                if (favoriteItems.find(item2 => item2.productId === item.id)) {
                    favorites.push(item);
                } else {
                    nonFavorites.push(item);
                }
                return [favorites, nonFavorites];
            },
            [[], []]
        );
        
        return { favoriteItemsFiltered, nonFavoriteItems };
      
    }, [favoriteItems]);

    const addFavoriteItem = async (productId: number) => {
        await createFavoriteItem(userId, productId, token);
    }

    const deleteFavoriteItem = async (productId: number) => {
        await deleteFavoriteProductByUserAndProduct(userId, productId, token);
    }

    useEffect(() => {
        if(isAuthenticated){
            fetchFavoriteItems(userId);
        }
    },[userId])

    /**
     * @description Get favorite products and set "isFavorit" of all fav products to true
     * @param products 
     * @param userId 
     * @param token 
     
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
                console.log("FAv: ", tmpProducts)
            }
        }
        // If no logged in, keep all products
        else {
            setProducts(products);
        }
    }
    */

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
            setProducts(data);
        } catch( err: any){
        }
    }

    /**
     * @description User the userId and Token to initilize the favorite items, which will take effect when logged in.
     * @param userId 
     * @param token 
     
    const initFavoriteItems = async (userId: number, token: string) => {
        let data = await getProducts();
        filterFavorites(data, userId, token);
    }
    */
    /**
     * Simple Product initializiation at app start
     */
    const initProducts = async() => {
        let data = await getProducts();
        console.log("Init Products ", data)
        setProducts(data);
        // trigger the filterFavoriteItems, in order to init useMemo with nonFilteredProducts
        if(favoriteItems.length === 0)
            setFavoriteItems([])
    }

    useEffect(() => {
        initProducts();
    }, [])

    return (
        <DataContext.Provider value={{products, fetchAndSetProductsByName, filterFavoriteItems, addFavoriteItem, deleteFavoriteItem}}>
            {children}
        </DataContext.Provider>
    )
}

export { DataContextProvider, useData }