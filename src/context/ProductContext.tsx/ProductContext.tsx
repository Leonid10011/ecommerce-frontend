import React, { createContext, useContext, useEffect } from 'react';
import useProductApi from '../../hooks/useProductApi';
import useProductFilter from '../../hooks/useProductFilter';
import useFavoriteProducts from '../../hooks/useFavoriteProducts';
import { FilterActionType, FilterStateType } from '../../reducer/filterReducer';

export interface Product {
    id: number,
    name: string,
    description: string,
    price: number,
    categoryID: number,
    quantity: number,
    imgURL: string,
}

interface ProductContextInterface {
    products: Product[],
    loading: boolean,
    error: Error | null,
    fetchProducts: () => void,
    fetchProductsByName: (name: string) => void,
    favoriteProductsFiltered: { favoriteProducts: Product[], nonFavoriteProducts: Product[] },
    manageFilter: (action: FilterActionType) => void,
    filterConditions: FilterStateType,
}

const ProductContext = createContext<ProductContextInterface | null>(null);

export const ProductProvider = ({ children }: {
    children: React.ReactNode
}) => {
    const { products, loading, error, fetchProducts, fetchProductsByName } = useProductApi();

    const { filteredProducts, resetFilter, manageFilter, filterConditions } = useProductFilter(products);

    const { favoriteItems, addFavoriteItem, deleteFavoriteItem, favoriteProductsFiltered } = useFavoriteProducts(filteredProducts);

    const value = {
        products,
        loading,
        error,
        fetchProducts,
        fetchProductsByName,
        favoriteProductsFiltered,
        manageFilter,
        filterConditions
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