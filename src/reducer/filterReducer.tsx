interface FilterStateType {
    category: number,
    price: {
        op: string,
        value: number,
    },
    filter: Boolean,
}

export type FilterActionType =
| { type: 'SET_CATEGORY'; payload: number }
| { type: 'SET_PRICE_OP'; payload: string }
| { type: 'SET_PRICE_VALUE'; payload: number }
| { type: 'SET_FILTER'; payload: Boolean};
  
export const reducer = (state: FilterStateType, action: FilterActionType): FilterStateType => {
    switch ( action.type ) {
        case 'SET_CATEGORY':
            return { ...state, category: action.payload };
        case 'SET_PRICE_OP':
            return { ...state, price: { ...state.price, op: action.payload}};
        case 'SET_PRICE_VALUE':
            return { ...state, price: { ...state.price, value: action.payload}};
        case 'SET_FILTER':
            return { ...state, filter: action.payload}    
        default:
            throw new Error("Unhandled action type");
    }
}
