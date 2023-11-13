import { useEffect, useState } from "react";
import { getProducts, getProductsByName } from "../api/productApi";
import { ApiResponse, Product } from "../types/ApiInterfaces";

/**
 * Custom hook for managing and fetching product data.
 */
const useProductApi = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    /**
     * Fetches all products and updates the state.
     * This function is called initially on the component mount.
     */
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res: ApiResponse<Product[]> = await getProducts();
            if (res.data) {
                setProducts(res.data);
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error);
            } else {
                setError(new Error("An unexpected error occurred"));
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fetches products by name and updates the state.
     * 
     * @param name - The name of the product to search for.
     */
    const fetchProductsByName = async (name: string) => {
        setLoading(true);
        try {
            const res: ApiResponse<Product[]> = await getProductsByName(name);
            if (res.data) {
                setProducts(res.data);
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error);
            } else {
                setError(new Error("An unexpected error occurred"));
            }
        } finally {
            setLoading(false);
        }
    };

    // Automatically fetches all products when the component using this hook is mounted.
    useEffect(() => {
        fetchProducts();
    }, []);

    return {
        products,
        loading,
        error,
        fetchProducts,
        fetchProductsByName
    };
};

export default useProductApi;
