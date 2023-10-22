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

export { getProducts };