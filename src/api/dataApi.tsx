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

        let res = await fetch(`product/get/${name}`, requestOptions);
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

const getOrder = async (userId: number) => {
    try {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
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
}) => {
    console.log("DA", orderItemDTO.productId)
    try {
        const requestHeaders = {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'Accept': 'application/json'
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


const getItems = async (orderId: number) => {
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

export { getProducts, getProductsByName, getOrder,createOrder, addItem, getItems };