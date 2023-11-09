/**
 * We use this Context to retrieve Product related data 
 */
import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { FavoriteProductDTO, createFavoriteItem, deleteFavoriteProductByUserAndProduct, getFavoriteItemsByUser } from "../api/favoriteItemApi";
import { useAuth } from "./authContext";
import { getProducts, getProductsByName } from "../api/productApi";
import { ApiResponse } from "../types/api/apiTypes";
import { FilterActionType, FilterStateType, reducer } from "../reducer/filterReducer";
import { stat } from "fs";

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
    filterProducts: [],
    manageFilter: () => {},
    filter: () => {},
    resetFilter:() => {},
    state: {
        category: [],
        price: {
            minValue: 0,
            maxValue: -1,
        },
        filter: false,
    },
}

interface ProductContextType {
    products: Product[],
    fetchAndSetProductsByName: (name: string) => void,
    filterFavoriteItems: { favoriteItemsFiltered: Product[], nonFavoriteItems: Product[] },
    addFavoriteItem: (productId: number) => void,
    deleteFavoriteItem: (productId: number) => void, 
    filterProducts: Product[],
    manageFilter: (action: FilterActionType) => void,
    filter: () => void,
    resetFilter: () => void,
    state: FilterStateType,
}

const ProductContext = createContext<ProductContextType>(initData);

const useProduct = () => useContext(ProductContext);

const ProductContextProvider = ({children}: {
    children: React.ReactNode
}) => {

    const [products, setProducts] = useState<Product[]>([]);
    const [favoriteItems, setFavoriteItems] = useState<FavoriteProductDTO[]>([]);
    const { userId, token, isAuthenticated } = useAuth();
    const [triggerFilter, setTriggerFiter] = useState<Boolean>(false);

    const [state, dispatch] = useReducer(reducer,
        {
            category: [],
            price: {
                minValue: 0,
                maxValue: -1,
            },
            filter: false,
        }
    );
    
    const resetFilter = () => {
        dispatch({type: 'RESET_CATEGORY', payload: void 0});
        dispatch({type: 'RESET_PRICE', payload: void 0});
        setTriggerFiter(prev => !prev);
        dispatch({type: 'SET_FILTER', payload: false});
    }

    const filter = () => {
        console.log("Trigger")
        setTriggerFiter(prev => !prev);
        dispatch({type: 'SET_FILTER', payload: true});
    }

    const manageFilter = (action: FilterActionType) => {
        dispatch(action);         
    }

    const filterProducts = useMemo(() => {
        const newProducts = products.filter( item => (
            state.category.includes(item.categoryID) &&
            item.price > state.price.minValue && 
            (state.price.maxValue > 0 
                ? (item.price < state.price.maxValue
                    ? true : false)
                    : true
        )));

        console.log("STATE ", state);
        console.log("Old: " + products + "\nNew: " + newProducts)
        return newProducts;
    },[triggerFilter])

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
        setTriggerFiter(prev => !prev);
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
        console.log("Change filterFavoriteItems");
        let newProducts; 
        if(state.filter){
            console.log("IF", state.filter);
            newProducts = [...filterProducts];
        }
        else{
            console.log("ELSE", state.filter);
            newProducts = [...products];
        } 
        const [favoriteItemsFiltered, nonFavoriteItems] = newProducts.reduce<[Product[], Product[]]>(
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
      
    }, [favoriteItems, filterProducts]);
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
        <ProductContext.Provider value={{products, fetchAndSetProductsByName, filterFavoriteItems, addFavoriteItem, deleteFavoriteItem, filterProducts, manageFilter, filter, resetFilter, state}}>
            {children}
        </ProductContext.Provider>
    )
}

export { ProductContextProvider, useProduct }