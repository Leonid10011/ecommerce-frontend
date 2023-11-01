import { Product } from "../context/dataContext";

const getProducts = async () => {
    try {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        };
    
        let res = await fetch('/product/get', requestOptions);
        let data = res.json();
        return data;
    } catch( err: any ){
        return [];
    }
}

const getProductsByName = async (name: string) => {
    try {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        };

        let res = await fetch(`product/getByName/${name}`, requestOptions);
        console.log(res);
        // If not found, return emtpy set
        if(res.status == 404)
            return [];
        else return res.json();

    } catch(err: any){
        console.error("Error: ", err);
        return [];
    }
}

const getOrder = async (userId: number, token: string) => {
    try {
        console.log("ORDer token: ", token)
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }

        let res = await fetch("/order/get/" + userId, requestOptions);
        let data = res.json();
        return data;

    } catch( err: any){
        console.error("ERROR");
        return null;
    }
}

const createOrder = async (userId: number, date: Date, status: string) => {
    try {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                userId: userId,
                date: date,
                status: status
            })
        };

        let res = await fetch("/order/create", requestOptions);
        
        console.log(res);

        return true;
    } catch( err: any) {
        return false;
    }
}

const addItem = async (orderItemDTO: {
    orderId: number,
    productId: number,
    quantity: number,
    price: number
}, token: string) => {
    console.log("DA", orderItemDTO.productId)
    try {
        const requestHeaders = {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                orderId: orderItemDTO.orderId,
                productId: orderItemDTO.productId,
                quantity: orderItemDTO.quantity,
                price: orderItemDTO.price
            })
        };

        let res =  await fetch('/order/addItem', requestHeaders);
        let data = res;

        console.log(data);
        return true;
    } catch(err: any) {
        return false
    }
}


const getOrderItems = async (orderId: number) => {
    try {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }

        let res = await fetch('/order/getItems/' + orderId, requestOptions);
        let data = res.json();
        
        return data;
    } catch(err: any) {
        console.error("Error get Items", err);
    }
} 

const getOrderItemProducts = async (orderId: number) => {
    try {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }

        let res = await fetch('/order/getOrderProduct/' + orderId, requestOptions);
        let data = res.json();
        
        return data;
    } catch(err: any) {
        console.error("Error get Items", err);
    }
} 

const createFavoriteItem = async (userId: number, productId: number, token: string) => {
    try {
        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                userId: userId,
                productId: productId
            })
        };

        let res = await fetch('/favoriteItem/', requestOptions);
        if(res.status === 400)
            return false;
        else if(res.status === 201)
            return res.json();
    } catch(err: any){
        console.error("Error creating favorite items. ", err);
        return false;
    }
}

const getFavoriteProductsByUser = async (userId: number, token: string) => {
    try {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`
            }
        };

        let res = await fetch('/favoriteItem/getByUser/' + userId, requestOptions);
        
        return {
            status: res.status,
            data: res.status === 200 ?  await res.json() as Product[] : null
        }

    } catch(error: any){
        return {
            status: 500,
            data: null
        }
    }
}

const deleteFavoriteProductByUserAndProduct = async (userId: number, productId: number, token: string) => {
    try {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                id: 0,
                userId: userId,
                productId: productId
            })
        };

        let res = await fetch('/favoriteItem/delete', requestOptions);
        return {
            status: res.status,
            data: true
        }
    } catch(err: any){
        return {
            status: 500,
            data: false
        }
    }
}
export { 
    getProducts, 
    getProductsByName, 
    getOrder,
    createOrder, 
    addItem, 
    getOrderItems,
    getOrderItemProducts, 
    createFavoriteItem, 
    getFavoriteProductsByUser,
    deleteFavoriteProductByUserAndProduct
 };