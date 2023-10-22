import React, { createContext, useContext, useEffect, useState } from "react";
import { getProducts } from "../api/dataApi";

interface Product {
    id: string,
    name: string,
    description: string,
    price: number,
    categoryID: number,
    quantity: number,
    imageURL: ""
}

const initData = {
    products: [],
}
interface DataContextType {
    products: Product[],
}

const DataContext = createContext<DataContextType>(initData);

const useData = () => useContext(DataContext);

const DataContextProvider = ({children}: {
    children: React.ReactNode
}) => {

    const [products, setProducts] = useState<Product[]>([]);

    const fetchAndSetProducts = async () => {
        let data = await getProducts();
        setProducts(data);
    }

    useEffect(() => {
        fetchAndSetProducts();
    }, [])

    return (
        <DataContext.Provider value={{products}}>
            {children}
        </DataContext.Provider>
    )
}

export { DataContextProvider, useData }