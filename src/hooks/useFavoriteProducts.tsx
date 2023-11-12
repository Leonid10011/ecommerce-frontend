import { useEffect, useMemo, useState } from "react";
import { createFavoriteItem, deleteFavoriteProduct, getFavoriteItemsByUser } from "../api/favoriteItemApi";
import { ApiResponse, FavoriteProduct, Product } from "../types/ApiInterfaces";

export interface FilteredFavoriteProduct extends Product {
    favoriteProductId: number
}

const useFavoriteProducts = (filteredProducts: Product[], userId: number, token: string) => {
    const [favoriteItems, setFavoriteItems] = useState<FavoriteProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFavoriteItems = async (userId: number) => {
        setLoading(true);
        const response = await getFavoriteItemsByUser(userId);
        setLoading(false);

        if(response.error){
            setError(response.error.message)
        } else if (response.data) {
            const newItems = [...response.data]
            setFavoriteItems(newItems);
        }

    }

    const addFavoriteItem = async (productId: number) => {
        setLoading(true);
        const response = await createFavoriteItem(userId, productId, token);
        setLoading(false);
        if(response.error){
            setError(response.error.message)
        } else if (response.data) {
            const newItems = [...favoriteItems, response.data]
            setFavoriteItems(newItems);
        }
    }

    const deleteFavoriteItem = async (favoriteItemId: number) => {
        setLoading(true);
        const response: ApiResponse<boolean> = await deleteFavoriteProduct(favoriteItemId, token);
        setLoading(false);
        if(response.error){
            setError(response.error.message)
        } else if (response.data) {
            const newItems = favoriteItems.filter(item => item.id !== favoriteItemId);
            setFavoriteItems([...newItems]);
        }
    }

    const favoriteProductsFiltered: {
        favoriteProducts: FilteredFavoriteProduct[];
        nonFavoriteProducts: Product[];
    } = useMemo(() => {
        console.log("Favorite Products Filtered memo: ", "test");
        let newProducts = [...filteredProducts];
        let tmpId: number;
        const [favoriteProducts, nonFavoriteProducts] = newProducts.reduce<[FilteredFavoriteProduct[], Product[]]>(
            ([favorites, nonFavorites], item) => {
                if(favoriteItems.find(item2 => { 
                    tmpId = item2.id
                    return item2.productId === item.id
                } )){
                    favorites.push({...item, favoriteProductId: tmpId});
                } else {
                    nonFavorites.push(item);
                }
                return [favorites, nonFavorites]
            }, [[], []]
        )
            console.log("Nonfavorite ", favoriteProducts, nonFavoriteProducts);
        return { favoriteProducts, nonFavoriteProducts }
    }, [filteredProducts ,favoriteItems]);

    useEffect(() => {
        fetchFavoriteItems(userId)
    }, [userId])

    return { favoriteItems, loading, error, addFavoriteItem, deleteFavoriteItem, favoriteProductsFiltered};
}

export default useFavoriteProducts;