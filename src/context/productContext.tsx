/**
 * We use this Context to retrieve Product related data 
 */
import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { FavoriteProduct, createFavoriteItem, deleteFavoriteProductByUserAndProduct, getFavoriteItemsByUser } from "../api/favoriteItemApi";
import { useAuth } from "./authContext";
import { getProducts, getProductsByName } from "../api/productApi";
import { ApiResponse } from "../types/ApiInterfaces";
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
    resetFilter:() => {},
    state: {
        category: [],
        price: {
            minValue: 0,
            maxValue: 0,
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
    resetFilter: () => void,
    state: FilterStateType,
}

const ProductContext = createContext<ProductContextType>(initData);

const useProduct = () => useContext(ProductContext);

const ProductContextProvider = ({children}: {
    children: React.ReactNode
}) => {
    
    const [products, setProducts] = useState<Product[]>([]);
    const [favoriteItems, setFavoriteItems] = useState<FavoriteProduct[]>([]);
    const { userId, token, isAuthenticated } = useAuth();
    const [triggerFilter, setTriggerFilter] = useState<Boolean>(false);

    const [state, dispatch] = useReducer(reducer,
        {
            category: [],
            price: {
                minValue: 0,
                maxValue: 0,
            },
            filter: true,
        }
    );
    
    /**
     * @description Main fetch for products
     */
    const fetchAndSetProducts = async() => {
        const res: ApiResponse<Product[]> = await getProducts();
        if(res.data){
            const newProducts = [...res.data];
            setProducts(newProducts);
            // trigger the filterFavoriteItems, in order to init useMemo with nonFilteredProducts
            setFavoriteItems([...favoriteItems])
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
    const fetchAndSetProductsByName = async (name: string) => {
        if(name != ""){
            const res: ApiResponse<Product[]> = await getProductsByName(name);
            if(res.data){
                const newProducts = [...res.data];
                setProducts(newProducts);
            }
        } else {
            fetchAndSetProducts();
        }
        // trigger the filterFavoriteItems, in order to init useMemo with nonFilteredProducts
        setFavoriteItems([...favoriteItems]);
        // filter after changing the Products
        setTriggerFilter(prev => !prev);
    } 

    //########### FILTERING ################
    /**
     * @description resets the filters and its condition
     */
    const resetFilter = () => {
        dispatch({type: 'RESET_CATEGORY', payload: void 0});
        dispatch({type: 'RESET_PRICE', payload: void 0});
        setTriggerFilter(prev => !prev);
    }

    /**
     * @description apply filter conditions
     * @param action
     */
    const manageFilter = (action: FilterActionType) => {
        dispatch(action);         
    }

    /**
     * @description filtering products by filter condition
     */
    const filterProducts = useMemo(() => {
        const isCategorySelected = (catId: number) => state.category.length === 0 || state.category.includes(catId);
        const isPriceWithinRange = (price: number) => {
            const isAboveMin = state.price.minValue === 0 || price >= state.price.minValue;
            const isBelowMax = state.price.maxValue === 0 || price <= state.price.maxValue;
            return isAboveMin && isBelowMax;
        };
    
        return products.filter(item => isCategorySelected(item.categoryID) && isPriceWithinRange(item.price));
    }, [state.category, state.price.minValue, state.price.maxValue, products]);
    
    

    /**
     * @description Initilize products
     */
    useEffect(() => {
        fetchAndSetProducts();
    }, [])

    // ######## FAVORITE ITEMS #############
    /**
     * @description Fetch FavoriteItems by userId
     * @param userId: number
     */
    const fetchFavoriteItems = async (userId: number) => {
        const favoriteItems = await getFavoriteItemsByUser(userId);
        if(favoriteItems.data){
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
        if(res.data){
            const newFavoriteItem = res.data;
            const updatedfavoriteItems = [...favoriteItems, newFavoriteItem];
            setFavoriteItems(updatedfavoriteItems);
        }
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
    /**
     * @description when the client logs in then fetch the favorite items
     */
    useEffect(() => {
        if(isAuthenticated){
            fetchFavoriteItems(userId);
        }
    },[userId])

    

    return (
        <ProductContext.Provider value={{products, 
            fetchAndSetProductsByName, 
            filterFavoriteItems, 
            addFavoriteItem, 
            deleteFavoriteItem, 
            filterProducts, 
            manageFilter, 
            resetFilter, 
            state
        }}>
            {children}
        </ProductContext.Provider>
    )
}

export { ProductContextProvider, useProduct }