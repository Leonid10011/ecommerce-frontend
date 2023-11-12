import { useEffect, useState } from "react"
import { getProducts, getProductsByName } from "../api/productApi"
import { ApiResponse, Product } from "../types/ApiInterfaces";

const useProductApi = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res: ApiResponse<Product[]> = await getProducts();
            if(res.data) {
                setProducts(res.data);
            }
        } catch (error) {
            if(error instanceof Error) {
                setError(error);
            } else {
                setError(null);
            }
        } finally {
            setLoading(false);
        }
    }

    const fetchProductsByName = async (name: string) => {
        setLoading(true);
        try {
            const res: ApiResponse<Product[]> = await getProductsByName(name);
            if(res.data){
                setProducts(res.data);
            }
        } catch (error){
            if(error instanceof Error) {
                setError(error)
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    return {
        products,
        loading,
        error,
        fetchProducts,
        fetchProductsByName
    }
}

export default useProductApi;