import { Category } from "@mui/icons-material";
import createTypography from "@mui/material/styles/createTypography";

export interface FilterStateType {
    category: number[],
    price: {
        minValue: number,
        maxValue: number,
    },
    filter: Boolean,
}

export type FilterActionType =
| { type: 'SET_CATEGORY'; payload: number }
| { type: 'SET_PRICE_MINVALUE'; payload: number }
| { type: 'SET_PRICE_MAXVALUE'; payload: number }
| { type: 'SET_FILTER'; payload: Boolean}
| { type: 'REMOVE_CATEGORY'; payload: number}
| { type: 'RESET_CATEGORY'; payload: void }
| { type: 'RESET_PRICE'; payload: void }
  
export const reducer = (state: FilterStateType, action: FilterActionType): FilterStateType => {
    switch ( action.type ) {
        case 'SET_CATEGORY':
            return { ...state, category: [...state.category, action.payload] };
        case 'SET_PRICE_MINVALUE':
            return { ...state, price: { ...state.price, minValue: action.payload}};
        case 'SET_PRICE_MAXVALUE':
            return { ...state, price: { ...state.price, maxValue: action.payload}};
        case 'SET_FILTER':
            return { ...state, filter: action.payload};
        case 'REMOVE_CATEGORY':
            return {...state, category: state.category.filter( item => item !== action.payload)}
        case 'RESET_CATEGORY':
            return {...state, category: []}
        case 'RESET_PRICE':
            return {...state, price: {...state.price, minValue: 0, maxValue: -1}}    
        default:
            throw new Error("Unhandled action type");
    }
}
