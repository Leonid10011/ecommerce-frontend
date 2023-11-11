import React, { createContext, useContext } from 'react';
import useProductApi from '../../hooks/useProductApi';
import { Product } from '../productContext';

interface ProductContextInterface {
    products: Product[],
    loading: boolean,
    error: Error | null,
    fetchProducts: () => void,
    fetchProductsByName: (name: string) => void,
}

const ProductContext = createContext<ProductContextInterface | null>(null);

export const ProductProvider = ({ children }: {
    children: React.ReactNode
}) => {
    const { products, loading, error, fetchProducts, fetchProductsByName } = useProductApi();

    const value = {
        products,
        loading,
        error,
        fetchProducts,
        fetchProductsByName
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (context === null) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};