/**
 * We use this Context to retrieve Product related data 
 */
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { FavoriteProductDTO, createFavoriteItem, deleteFavoriteProductByUserAndProduct, getFavoriteItemsByUser } from "../api/favoriteItemApi";
import { useAuth } from "./authContext";
import { getProducts, getProductsByName } from "../api/productApi";
import { ApiResponse } from "../types/api/apiTypes";

export interface Product {
    id: number,
    name: string,
    description: string,
    price: number,
    categoryID: number,
    quantity: number,
    imgURL: string,
}

const initData = {
    products: [],
    fetchAndSetProductsByName: () => {},
    filterFavoriteItems: { favoriteItemsFiltered: [] as Product[], nonFavoriteItems: [] as Product[] },
    addFavoriteItem: () => {},
    deleteFavoriteItem: () => {},

}
interface ProductContextType {
    products: Product[],
    fetchAndSetProductsByName: (name: string) => void,
    filterFavoriteItems: { favoriteItemsFiltered: Product[], nonFavoriteItems: Product[] },
    addFavoriteItem: (productId: number) => void,
    deleteFavoriteItem: (productId: number) => void, 
}

const ProductContext = createContext<ProductContextType>(initData);

const useProduct = () => useContext(ProductContext);

const ProductContextProvider = ({children}: {
    children: React.ReactNode
}) => {

    const [products, setProducts] = useState<Product[]>([]);
    const [favoriteItems, setFavoriteItems] = useState<FavoriteProductDTO[]>([]);
    const { userId, token, isAuthenticated } = useAuth();

    const fetchAndSetProducts = async() => {
        const res: ApiResponse<Product[]> = await getProducts();
        const newProducts = [...res.data];
        setProducts(newProducts);
        // trigger the filterFavoriteItems, in order to init useMemo with nonFilteredProducts
        setFavoriteItems([...favoriteItems])
    }

    /**
     * @description use searchtag name to only get products containing that term. 
     * filterFAvorite will only affect if there are any favorite items.
     * if the user is not present, then favorites won't take an effect.
     * @param name 
     * @param userId 
     * @param token 
     */
    const fetchAndSetProductsByName = async (name: string) => {
        console.log("Fetch by Name; dataContext");
        if(name != ""){
            const res: ApiResponse<Product[]> = await getProductsByName(name);
            const newProducts = [...res.data];
            setProducts(newProducts);
        } else {
            fetchAndSetProducts();
        }
        // trigger the filterFavoriteItems, in order to init useMemo with nonFilteredProducts
        setFavoriteItems([...favoriteItems]);
    }       
    
    useEffect(() => {
        fetchAndSetProducts();
    }, [])

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
        const updatedfavoriteItems = favoriteItems.filter(item => (item.productId != productId));
        setFavoriteItems(updatedfavoriteItems);
    }

    useEffect(() => {
        if(isAuthenticated){
            fetchFavoriteItems(userId);
        }
    },[userId])

    

    return (
        <ProductContext.Provider value={{products, fetchAndSetProductsByName, filterFavoriteItems, addFavoriteItem, deleteFavoriteItem}}>
            {children}
        </ProductContext.Provider>
    )
}

export { ProductContextProvider, useProduct }