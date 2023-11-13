import { useEffect, useMemo, useReducer } from "react";
import { FilterActionType, filterReducer } from "../reducer/filterReducer";
import { Product } from "../types/ApiInterfaces";

const initialFilterConditions = {
    category: [],
    price: {
        minValue: 0,
        maxValue: 0
    }
};

/**
 * Custom hook for managing and applying filters to a list of products.
 * 
 * @param products - The array of products to be filtered.
 */
const useProductFilter = (products: Product[]) => {
    const [filterConditions, dispatch] = useReducer(filterReducer, initialFilterConditions);

    /**
     * Resets the filter conditions to their initial state.
     */
    const resetFilter = () => {
        dispatch({ type: 'RESET_CATEGORY', payload: void 0 });
        dispatch({ type: 'RESET_PRICE', payload: void 0 });
    };

    /**
     * Dispatches a filter action to the reducer to update the filter conditions.
     * 
     * @param action - The action to be dispatched.
     */
    const manageFilter = (action: FilterActionType) => {
        dispatch(action);
    };

    /**
     * Memoized array of products filtered based on the current filter conditions.
     */
    const filteredProducts = useMemo(() => {
        const isCategorySelected = (catId: number) => filterConditions.category.length === 0 || filterConditions.category.includes(catId);
        const isPriceWithinRange = (price: number) => {
            const isAboveMin = filterConditions.price.minValue === 0 || price >= filterConditions.price.minValue;
            const isBelowMax = filterConditions.price.maxValue === 0 || price <= filterConditions.price.maxValue;
            return isAboveMin && isBelowMax;
        };

        return products.filter(item => isCategorySelected(item.categoryID) && isPriceWithinRange(item.price));
    }, [products, filterConditions]);

    // Effect to log changes in the filtered products.
    useEffect(() => {
        console.log("Filtered Product changed");
    }, [filteredProducts]);

    return { filteredProducts, resetFilter, manageFilter, filterConditions };
};

export default useProductFilter;
