import React, { createContext, useContext, useEffect, useState } from "react";
import { getProducts, getProductsByName } from "../api/dataApi";

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
    fetchAndSetProductsByName: () => {}
}
interface DataContextType {
    products: Product[],
    fetchAndSetProductsByName: (name: string) => void;
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

    const fetchAndSetProductsByName = async (name: string) => {
        try {
            let data = await getProductsByName(name);
            setProducts(data);
            console.log("qwerty", data);
        } catch( err: any){
            console.error("Error: ", err);
        }
    }

    useEffect(() => {
        fetchAndSetProducts();
    }, [])

    return (
        <DataContext.Provider value={{products, fetchAndSetProductsByName}}>
            {children}
        </DataContext.Provider>
    )
}

export { DataContextProvider, useData }