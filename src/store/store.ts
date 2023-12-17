import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../reducers/counterSlice";
import authReducer from "../reducers/authSlice";

const store = configureStore({
    reducer: {
        counter: counterReducer,
        auth: authReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;