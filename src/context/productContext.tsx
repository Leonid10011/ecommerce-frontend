/**
 * We use this Context to retrieve Product related data 
 */
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
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
        console.log("memo")

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
    /**
     * Post a new favoriteItem for the productId. 
     * Afterwards add the favoriteItem to locale state and trigger filterFavoriteItems memo. 
     * No refetch requrired for this session.
     * @param productId 
     */
    const addFavoriteItem = async (productId: number) => {
        const res = await createFavoriteItem(userId, productId, token);
        const newFavoriteItem = res.data;
        const updatedfavoriteItems = [...favoriteItems, newFavoriteItem];
        setFavoriteItems(updatedfavoriteItems);
    }
    /**
     * Delete a favoiteItem from the database. 
     * Afterwards delete from localState and trigger filterFavoriteItems memo.
     * No refresh required.
     * @param productId 
     */
    const deleteFavoriteItem = async (productId: number) => {
        await deleteFavoriteProductByUserAndProduct(userId, productId, token);
        console.log("Delete FavoritItzems: ", favoriteItems, " ", userId, " ", productId)
        const updatedfavoriteItems = favoriteItems.filter(item => (item.productId != productId));
        console.log("updateded delete", updatedfavoriteItems)
        setFavoriteItems(updatedfavoriteItems);

        console.log(favoriteItems)
    }

    useEffect(() => {
        if(isAuthenticated){
            fetchFavoriteItems(userId);
        }
    },[userId])

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