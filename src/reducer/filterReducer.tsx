/**
 * Represents the state of filters, including category and price range filters.
 */
export interface FilterStateType {
    /** Array of category IDs */
    category: number[];
    
    /** Object representing the price range */
    price: {
        /** Minimum value of the price range */
        minValue: number;
        
        /** Maximum value of the price range */
        maxValue: number;
    };
}

/**
 * Defines the types of actions that can be dispatched to update the filter state.
 */
export type FilterActionType =
    | { type: 'SET_CATEGORY'; payload: number }             // Adds a category ID to the filter
    | { type: 'SET_PRICE_MINVALUE'; payload: number }       // Sets the minimum price
    | { type: 'SET_PRICE_MAXVALUE'; payload: number }       // Sets the maximum price
    | { type: 'SET_FILTER'; payload: Boolean}               // Sets a filter (details unspecified)
    | { type: 'REMOVE_CATEGORY'; payload: number}           // Removes a category ID from the filter
    | { type: 'RESET_CATEGORY'; payload: void }             // Clears all category filters
    | { type: 'RESET_PRICE'; payload: void }                // Resets the price range to default

/**
 * Reducer function for managing filter state.
 * 
 * @param state - The current state of the filters.
 * @param action - The action to be applied to the state.
 * @returns The updated filter state.
 */
export const filterReducer = (state: FilterStateType, action: FilterActionType): FilterStateType => {
    switch ( action.type ) {
        case 'SET_CATEGORY':
            // Adds a new category ID to the list of categories
            return { ...state, category: [...state.category, action.payload]};
        case 'SET_PRICE_MINVALUE':
            // Sets the minimum price, ensuring it's not less than 0
            return { ...state, price: { ...state.price, minValue: Math.max(0, action.payload) }};
        case 'SET_PRICE_MAXVALUE':
            // Sets the maximum price, ensuring it's not less than the minimum price
            return { ...state, price: { ...state.price, maxValue: Math.max(action.payload, state.price.minValue) }};
        case 'REMOVE_CATEGORY':
            // Removes a specific category ID from the list
            return {...state, category: state.category.filter(item => item !== action.payload)};
        case 'RESET_CATEGORY':
            // Clears all category filters
            return {...state, category: []};
        case 'RESET_PRICE':
            // Resets the price range to default
            return {...state, price: { minValue: 0, maxValue: 0 }};
        default:
            // Handles unhandled action types
            throw new Error("Unhandled action type");
    }
};
