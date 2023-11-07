import { Product } from "../context/productContext";

const api_path = "http://85.215.54.122";

enum HttpStatusCode {
    OK = 200,
    created = 201,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    Conflict = 409,
    InternalServerError = 500,
}

interface ApiResponse<T> {
    data: T,
    status: HttpStatusCode
}

const getProducts = async () => {
    console.log("Get Products Debug");
    try {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        };
    
        let res = await fetch(api_path + '/product/get', requestOptions);
        let data = res.json();
        return data;
    } catch( err: any ){
        return [];
    }
}

const getProductsByName = async (name: string) => {
    console.log("Get Products By Name Debug");
    try {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        };

        let res = await fetch(api_path + `/product/getByName/${name}`, requestOptions);
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
    console.log("Get Order Debug");
    try {
        console.log("ORDer token: ", token)
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }

        let res = await fetch(api_path + "/order/get/" + userId, requestOptions);
        console.log("getOrder res: ", res);
        if(res.ok){
            let data = res.json();
            return data;

        }

        return null

    } catch( err: any){
        console.error("ERROR");
        return null;
    }
}

const createOrder = async (userId: number, date: Date, status: string) => {
    console.log("Create Order Debug");
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

        let res = await fetch(api_path + "/order/create", requestOptions);
        
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
    console.log("Add Item Debug");
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

        let res =  await fetch(api_path + '/order/addItem', requestHeaders);
        let data = res;

        console.log(data);
        return true;
    } catch(err: any) {
        return false
    }
}


const getOrderItems = async (orderId: number) => {
    console.log("Get Order Items Debug");
    try {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }

        let res = await fetch(api_path + '/order/getItems/' + orderId, requestOptions);
        let data = res.json();
        
        return data;
    } catch(err: any) {
        console.error("Error get Items", err);
    }
} 

const getOrderItemProducts = async (orderId: number) => {
    console.log("Get Order Item Products Debug");
    try {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }

        let res = await fetch(api_path + '/order/getOrderProduct/' + orderId, requestOptions);
        let data = res.json();
        
        return data;
    } catch(err: any) {
        console.error("Error get Items", err);
    }
} 

const createFavoriteItem = async (userId: number, productId: number, token: string) => {
    console.log("Create Favorite Item Debug");
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

        let res = await fetch(api_path + '/favoriteItem/', requestOptions);
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
    console.log("Get Favorite Products By User Debug");
    try {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`
            }
        };

        let res = await fetch(api_path + '/favoriteItem/getByUser/' + userId, requestOptions)

        console.log("RES ", res)

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
    console.log("Delete Favorite Products BY User & Product Debug");
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

        let res = await fetch(api_path + '/favoriteItem/delete', requestOptions);
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

export interface FavoriteProductDTO {
    id: number,
    userId: number,
    productId: number
}

const getFavoriteItemsByUser = async (userId: number): Promise<ApiResponse<FavoriteProductDTO[]>> => {
    try {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }

        const res:  Response = await fetch(`${api_path}/favoriteItem/getProductIdsByUser/${userId}`, requestOptions); 
        if(res.ok) {
            const data: FavoriteProductDTO[] = await res.json() as FavoriteProductDTO[];
            return {
                data,
                status: res.status
            }
        } else {
            throw new Error(`HTTP error! status: ${res.status}` )
        }
    } catch (error){
        console.error('Error requestin favorite items.', error);
        throw error;
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
    deleteFavoriteProductByUserAndProduct,
    getFavoriteItemsByUser
 };