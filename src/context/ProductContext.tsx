import React, { createContext, useContext, useEffect } from 'react';
import useProductApi from '../hooks/useProductApi';
import useProductFilter from '../hooks/useProductFilter';
import useFavoriteProducts from '../hooks/useFavoriteProducts';
import { FilterActionType, FilterStateType } from '../reducer/filterReducer';
import { useAuth } from './authContext';
import useOrderApi, { OrderItemRequestDTO } from '../hooks/useOrderApi';
import { Order, OrderItemResponseDTO, Product } from '../types/ApiInterfaces';

const ProductContext = createContext<ProductContextInterface | null>(null);

export const ProductProvider = ({ children }: {
    children: React.ReactNode
}) => {
    const { products, loading, error, fetchProducts, fetchProductsByName } = useProductApi();

    const { userId, token, isAuthenticated } = useAuth();

    const { filteredProducts, resetFilter, manageFilter, filterConditions } = useProductFilter(products);

    const { favoriteItems, addFavoriteItem, deleteFavoriteItem, favoriteProductsFiltered } = useFavoriteProducts(filteredProducts, userId, token);

    const { order, orderProducts, fetchAndSetOrder, fetchAndSetOrderProducts, addOrderItem, deleteOrderItem, resetCart } = useOrderApi(token);


    /**
     * Fetch order items when user signs in
     */
    useEffect(() => {
        console.log("login trigger");
        if(isAuthenticated){
            fetchAndSetOrder(userId);          
        }
        
    }, [userId])

    const value = {
        products,
        loading,
        error,
        fetchProducts,
        fetchProductsByName,
        favoriteProductsFiltered,
        manageFilter,
        filterConditions,
        addFavoriteItem,
        deleteFavoriteItem,
        orderProducts,
        resetCart,
        order,
        addOrderItem,
        deleteOrderItem,
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

interface ProductContextInterface {
    products: Product[],
    loading: boolean,
    error: Error | null,
    fetchProducts: () => void,
    fetchProductsByName: (name: string) => void,
    favoriteProductsFiltered: { favoriteProducts: Product[], nonFavoriteProducts: Product[] },
    manageFilter: (action: FilterActionType) => void,
    filterConditions: FilterStateType,
    addFavoriteItem: (productId: number) => Promise<void>,
    deleteFavoriteItem: (favoritItemId: number) => Promise<void>,
    orderProducts: OrderItemResponseDTO[],
    resetCart: () => void,
    order: Order | null,
    addOrderItem: (product: OrderItemRequestDTO) => void,
    deleteOrderItem: (orderId: number) => void,
}
