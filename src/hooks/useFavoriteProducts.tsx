import { useEffect, useMemo, useState } from "react";
import { createFavoriteItem, deleteFavoriteProduct, getFavoriteItemsByUser } from "../api/favoriteItemApi";
import { ApiResponse, FavoriteProduct, Product } from "../types/ApiInterfaces";
/**
 * Represents a filtered favorite product with additional properties.
 */
export interface FilteredFavoriteProduct extends Product {
    favoriteProductId: number
}

/**
 * Custom hook to manage favorite products.
 * 
 * @param filteredProducts - The array of products to filter.
 * @param userId - The ID of the current user.
 * @param token - Authentication token for API requests.
 */
const useFavoriteProducts = (filteredProducts: Product[], userId: number, token: string) => {
    const [favoriteItems, setFavoriteItems] = useState<FavoriteProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetches the favorite items of the user.
     * 
     * @param userId - The ID of the user whose favorite items are to be fetched.
     */
    const fetchFavoriteItems = async (userId: number) => {
        setLoading(true);
        const response = await getFavoriteItemsByUser(userId);
        setLoading(false);

        if (response.error) {
            setError(response.error.message);
        } else if (response.data) {
            setFavoriteItems([...response.data]);
        }
    };

    /**
     * Adds a product to the user's favorite items.
     * 
     * @param productId - The ID of the product to be added to favorites.
     */
    const addFavoriteItem = async (productId: number) => {
        setLoading(true);
        const response = await createFavoriteItem(userId, productId, token);
        setLoading(false);
        if (response.error) {
            setError(response.error.message);
        } else if (response.data) {
            console.log("AddFAve: ", favoriteItems)
            setFavoriteItems([...favoriteItems, response.data]);
        }
    };

    /**
     * Deletes a product from the user's favorite items.
     * 
     * @param favoriteItemId - The ID of the favorite item to be deleted.
     */
    const deleteFavoriteItem = async (favoriteItemId: number) => {
        setLoading(true);
        const response: ApiResponse<boolean> = await deleteFavoriteProduct(favoriteItemId, token);
        setLoading(false);
        if (response.error) {
            setError(response.error.message);
            // On success data is null, therefore if no error occurred error is null.
        } else if (!response.error) {
            const newItems = favoriteItems.filter(item => item.id !== favoriteItemId);
            setFavoriteItems([...newItems]);
        }
    };

    /**
     * Memoized value to categorize products into favorite and non-favorite based on the user's selection.
     */
    const favoriteProductsFiltered: {
        favoriteProducts: FilteredFavoriteProduct[];
        nonFavoriteProducts: Product[];
    } = useMemo(() => {
        let newProducts = [...filteredProducts];
        let tmpId: number;
        const [favoriteProducts, nonFavoriteProducts] = newProducts.reduce<[FilteredFavoriteProduct[], Product[]]>(
            ([favorites, nonFavorites], item) => {
                const favoriteItem = favoriteItems.find(item2 => item2.productId === item.id);
                if (favoriteItem) {
                    favorites.push({ ...item, favoriteProductId: favoriteItem.id });
                } else {
                    nonFavorites.push(item);
                }
                return [favorites, nonFavorites];
            }, [[], []]
        );
        return { favoriteProducts, nonFavoriteProducts };
    }, [filteredProducts, favoriteItems]);

    useEffect(() => {
        fetchFavoriteItems(userId);
    }, [userId]);

    return { favoriteItems, loading, error, addFavoriteItem, deleteFavoriteItem, favoriteProductsFiltered };
};

export default useFavoriteProducts;
