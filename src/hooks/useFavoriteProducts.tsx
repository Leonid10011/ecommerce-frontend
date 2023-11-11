import { useMemo, useState } from "react";
import { FavoriteProduct, createFavoriteItem, deleteFavoriteProduct, getFavoriteItemsByUser } from "../api/favoriteItemApi";
import { Product } from "../api/productApi";
import { ApiResponse } from "../types/ApiInterfaces";

interface FavoriteProductsHookInterface {
    products: Product[],
}

const useFavoriteProducts = (filteredProducts: Product[]) => {
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

    const addFavoriteItem = async (userId: number, token: string, productId: number) => {
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

    const deleteFavoriteItem = async (favoriteItemId: number, token: string) => {
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
        favoriteProducts: Product[];
        nonFavoriteProducts: Product[];
    } = useMemo(() => {
        console.log("Favorite Products Filtered memo: ", "test");
        let newProducts = [...filteredProducts];

        const [favoriteProducts, nonFavoriteProducts] = newProducts.reduce<[Product[], Product[]]>(
            ([favorites, nonFavorites], item) => {
                if(favoriteItems.find(item2 => item2.productId === item.id)){
                    favorites.push(item);
                } else {
                    nonFavorites.push(item);
                }
                return [favorites, nonFavorites]
            }, [[], []]
        )
            console.log("Nonfavorite ", favoriteProducts, nonFavoriteProducts);
        return { favoriteProducts, nonFavoriteProducts }
    }, [filteredProducts ,favoriteItems]);

    return { favoriteItems, loading, error, addFavoriteItem, deleteFavoriteItem, favoriteProductsFiltered};
}

export default useFavoriteProducts;