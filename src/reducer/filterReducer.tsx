import { Category } from "@mui/icons-material";
import createTypography from "@mui/material/styles/createTypography";

export interface FilterStateType {
    category: number[],
    price: {
        minValue: number,
        maxValue: number,
    },
}

export type FilterActionType =
| { type: 'SET_CATEGORY'; payload: number }
| { type: 'SET_PRICE_MINVALUE'; payload: number }
| { type: 'SET_PRICE_MAXVALUE'; payload: number }
| { type: 'SET_FILTER'; payload: Boolean}
| { type: 'REMOVE_CATEGORY'; payload: number}
| { type: 'RESET_CATEGORY'; payload: void }
| { type: 'RESET_PRICE'; payload: void }
  
export const filterReducer = (state: FilterStateType, action: FilterActionType): FilterStateType => {
    switch ( action.type ) {
        case 'SET_CATEGORY':
            return { ...state, category: [...state.category, action.payload]};
        case 'SET_PRICE_MINVALUE':
            return { ...state, price: { ...state.price, minValue: Math.max(0, action.payload) }};
        case 'SET_PRICE_MAXVALUE':
            return { ...state, price: { ...state.price, maxValue: Math.max(action.payload, state.price.minValue) }};
        case 'REMOVE_CATEGORY':
            return {...state, category: state.category.filter(item => item !== action.payload)};
        case 'RESET_CATEGORY':
            return {...state, category: []};
        case 'RESET_PRICE':
            return {...state, price: { minValue: 0, maxValue: -1 }};
        default:
            throw new Error("Unhandled action type");
    }
};
