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

export { getProducts, getProductsByName };