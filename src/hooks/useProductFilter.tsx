import { useEffect, useMemo, useReducer } from "react";
import { Product } from "../api/productApi"
import { FilterActionType, filterReducer } from "../reducer/filterReducer";

const initialFilterConditions = {
    category: [],
    price : {
        minValue: 0,
        maxValue: 0
    }
}

const useProductFilter = (products : Product[]) => {
    const [filterConditions, dispatch] = useReducer(filterReducer, initialFilterConditions);

    const resetFilter = () => {
        dispatch({type: 'RESET_CATEGORY', payload: void 0});
        dispatch({type: 'RESET_PRICE', payload: void 0});
    }

    const manageFilter = (action: FilterActionType) => {
        dispatch(action);
    }

    const filteredProducts = useMemo(() => {
        const isCategorySelected = (catId: number) => filterConditions.category.length === 0 || filterConditions.category.includes(catId);
        const isPriceWithinRange = (price: number) => {
            const isAboveMin = filterConditions.price.minValue === 0 || price >= filterConditions.price.minValue;
            const isBelowMax = filterConditions.price.maxValue === 0 || price <= filterConditions.price.maxValue;
            return isAboveMin && isBelowMax;
        };

        return products.filter(item => isCategorySelected(item.categoryID) && isPriceWithinRange(item.price));
    }, [products, filterConditions]);

    useEffect(() => {
        console.log("Filtered Product changed")
    }, [filteredProducts])

    return { filteredProducts, resetFilter, manageFilter, filterConditions }
}

export default useProductFilter;
    
    