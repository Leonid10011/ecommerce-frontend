# Ecommerce Frontend Docs

## Content
1. [Feature Overview](#feature-overview)
    1. [Products](#11-products)
    2. [Favorite Items](#12-favorite-items)
    3. [Orders and OrderItems](#13-order)
    4. [User Management](#14-user-management)
    5. [Filter Products](#15-filter-products)
2. [Data Logic](#data-logic)
    1. [Products](#11-products-1)
3. [Components](#componets)
    1. [Product Card](#productcard)
4. [Pages](#pages)

## Feature Overview

In this Section we will give a detailed introductions of various features of this app.

### 1.1 Products

#### ProductDTO
```typescript
interface Product {
    id: number,             // id of product
    name: string,           // name of the product
    description: string,    // description of the product
    price: number,          // price of the product
    categoryID: number,     // the category that the product belongs to
    quantity: number,       // the quantity of products available
    imgURL: string,         // the URL of the image belonging to this product
}
```

The products is the main data of the application. It holds various attributes that will help to represent a comprehensible product on the frontend. 

We initialize the products at the start of the application:

```typescript
// fetch the products and if the favoriteItems are empty, trigger favorite items
const fetchAndSetProducts = async() => {
    const res: ApiResponse<Product[]> = await getProducts();
    const newProducts = [...res.data];
    setProducts(newProducts);

    setFavoriteItems([...favoriteItems])
}

// When the productContext is loaded we fetch the products
useEffect(() => {
    fetchAndSetProducts();
}, [])
```

Additionally we also can fetch the products that only contain a specific substring. We avoid filtering the existing products in the state because it could create an overhead if the number of products is to large.

```typescript
const fetchAndSetProductsByName = async (name: string) => {
    const res: ApiResponse<Product[]> = await getProductsByName(name);
    const newProducts = [...res.data];
    setProducts(newProducts);

    setFavoriteItems([...favoriteItems]);
}       
```

### 1.2 Favorite Items

#### FavoriteItemDTO
```typescript
{
    id: number,             // id of the favoriteItem
    userId: number,         // id of the user of this favoriteItem
    productId: number,      // id of the product that represents this favoriteItem
}
```

####  Functionality

When we want to show the favorite products of a user, we filter the products simply by the corresponding id.

In the products list, we always show the favorite products on top of the list. This allow us to simply show the favorite products followed by the remaining products. Otherwise we would need to check each product in the list if it is part of the favorite products and this would create unnecessary overhead.

If we click on the favorite icon on a product in the list, we retrieve the product id and together with the user id, we post a new favoriteItem entry in the database. We also append it localy to the favoriteItems state, so we don't have to refetch the updated set of favoriteItems. For removing an Item, we proceed in the same way.

#### Method Description

We use a fetch function to initialize the fetched items by keeping track of changes to the userId.

```typescript
// Fetch items
const fetchFavoriteItems = async (userId: number) => {
    const favoriteItems = await getFavoriteItemsByUser(userId);
    if(favoriteItems.status === 200){
        setFavoriteItems(favoriteItems.data);
    }
}
// Initialize when userLogs in
useEffect(() => {
        if(isAuthenticated){
            fetchFavoriteItems(userId);
        }
    },[userId])
```

We use **useMemo()** to store the favoriteItems and only recalculate when the useStateItems is changed.

```typescript
const filterFavoriteItems: { ... } = useMemo(() => {
        const [favoriteItemsFiltered, nonFavoriteItems] = products.reduce<[Product[], Product[]]>(
            ([favorites, nonFavorites], item) => {
                if (favoriteItems.find(item2 => item2.productId === item.id)) {
                    favorites.push(item);
                } else {
                    nonFavorites.push(item);
                }
                return [favorites, nonFavorites];
            },
            [[], []]
        );
        
        return { favoriteItemsFiltered, nonFavoriteItems };
      
    }, [favoriteItems]);
```

This method operates on an existing **products** state, which is previousley fetched. So, this function holds the favorite Items and nonfavorite Items. We render them in the **Products** Component, which is the Page that show the list of all products.

```typescript
<Container maxWidth="sm" sx={{ position: 'relative', overflow: 'hidden', minHeight: '300px' }}>
          {favoriteItemsFiltered.map((product, index) => (
            <ProductCard key={product.id} product={product} handleBuy={handleBuy} isFavorite/>
          ))}
          {nonFavoriteItems.map((product, index) => (
            <ProductCard key={product.id} product={product} handleBuy={handleBuy} isFavorite={false}/>
          ))}
        
      </Container>
```

We simply list all favoriteProducts at first followed by the other products. 

In order to manipulate the list we use a **addFavoriteItem** and **deleteFavoriteItem** function in our productContext.

```typescript
const addFavoriteItem = async (productId: number) => {
    const res = await createFavoriteItem(userId, productId, token);
    const newFavoriteItem = res.data;
    const updatedfavoriteItems = [...favoriteItems, newFavoriteItem];
    setFavoriteItems(updatedfavoriteItems);
}

const deleteFavoriteItem = async (productId: number) => {
    await deleteFavoriteProductByUserAndProduct(userId, productId, token);
    const updatedfavoriteItems = favoriteItems.filter(item => (item.productId != productId));
    setFavoriteItems(updatedfavoriteItems);
}
```

Both functions update the database at first and then the local state. In that way we avoid refetching the favoriteItems for this user.

### 1.3 Order

#### OrderDTO
```typescript
interface OrderDTO {
    id: number,         // id of order
    userId: number,     // id the user that this order belongs to
    date: Date,         // the date it was created
    status: string,     // the status of the order(finished, in progress etc.)
}
```

#### OrderItemDTO
```typescript
interface OrderItemDTO {
    id: number,         // id of the orderItem
    orderId: number,    // id of the order this orderItem belongs to
    productId: number,  // id of the corresponding product
    quantity: number,   // the number that is currently ordered
    price: number,      // the price (inc. discount but not implemented yet)
}
```

#### Method Description

Everytime an product is put into the cart, we create an orderItem that holds the number of products that are being ordered and also a modified price depending on discounts. This information are stored seperatly from the actual product. 

We merge the orderItems and corresponding products into **OrderProductType**

```typescript
interface OrderProductType {
    id: number,
    name: string,
    description: string,
    imgURL: string,
    categoryId: number,
    quantity: number,
    price: number
};
```

 with the following function:

```typescript
const filterOrderItems: OrderProductType[] = useMemo(() => {
        try {
            const orderProducts = products.filter(
                item => orderItems.find(item2 => item.id === item2.productId)
            );
            if( orderProducts.length != orderItems.length)
                throw new Error("Number of products not equal to number oder OrdeItems, something went wrong.")
            
            // merge the product and orderItem properties
            const orderProductsMerged: OrderProductType[] = orderProducts.map(
                (orderProduct, index) => {
                    const orderItem = orderItems.find( item2 => item2.productId === orderProduct.id)!;
                    return {
                        id: orderProduct.id,
                        name: orderProduct.name,
                        description: orderProduct.description,
                        imgURL: orderProduct.imgURL,
                        categoryId: orderProduct.categoryID,
                        quantity: orderItem.quantity,
                        price: orderItem.price,
                    }
                }
            )
            
            return orderProductsMerged;

        } catch (error){
            console.error(`Not able to filter Products: ${error}`);
            throw error;
        }

    }, [orderItems]);
```

This function will throw an error if there is an orderItem with no corresponding product. But this should not happen when the rest is implemented correctly. 

When the app is started we run the following use effect to init the orderContext. But because we only allow cart for logged in users for now, the **initOrderCOntext** will only trigger when a user is logged in.

```typescript
useEffect(() => {
    if(isAuthenticated){
        initOrderContext();
    }
}, [userId])
```

The **initOrderCortext** function will call the following two functions to fetch order and orderItems:

```typescript
const fetchAndSetOrder = async () => {
    const resOrder: ApiResponse<OrderDTO> = await getOrder(userId, token);
    const newOrder = {
        ...resOrder.data
    }
    setOrder(newOrder);
}

const fetchAndSetOrderItems = async () => {
    let resOrderItems: ApiResponse<OrderItemDTO[]> = await getOrderItems(order.id);
    setOrderItems([...resOrderItems.data]);
}

const initOrderContext = () => {
    fetchAndSetOrder();
    fetchAndSetOrderItems();
}
```

We use the **filterOrderItems** to render our cartItems:

```typescript
const { filterFavoriteItems } = useProduct();

                        .
                        .
                        .

<Grid item display={'flex'} flexDirection={'column'} >
    {filterOrderItems.map((item, i) => {
        return (
            <CartCard key={item.id} orderProduct={item}/>
        )
    })}
</Grid>
```

### 1.4 User Management

#### UserDTO

```typescript
export interface UserDTO {
    id: number,
    username: string,
    email: string,
    roleId: number
    password: string,
}
```

### Functionality
In order to signup the client has to provide a username, email and a password. The roleId will be set to **1**, as this represnets a normal User in our backend. The **id** will be automatically set in the backend when a user is created and is set when a login request is fetched. 

At signing up a new order is created for the user. This will alow us to fetch the order in the **initOrderContext** on each login because the userId is changed. This functionality is just a placeholder. In future it is desired to create the order after the first item is put into an empty cart.

```typescript
const signUpUser = async (user: UserDTO): Promise<void> => {
    let resSignUp: ApiResponse<UserDTO> = await signUp(user);
    if(resSignUp.status === 201){
        // create a new order for this use on signup
        // will be handled differently in future
        createOrder(resSignUp.data.id, (new Date()), "open");
        // move to login
        navigation("/signin");
    } else if(resSignUp.status === 409){
        toast.error("Username already exists. Please try again.");
    } else {
        toast.error("Unexpected Error.")
    }
}
```

The **initOrderContext** part:

```typescript
useEffect(() => {
    if(isAuthenticated){
        initOrderContext();
    }
}, [userId])
```

When a client signs in, then it fetches a token from the backend. From this token we retrieve the userId and set it in the authContext. The return type indicate a successful login, so we can provide the client with feedback. Might be reworked in future.

```typescript
const fetchAndSetToken = async (email: string, password: string): Promise<Boolean>  => {
    const resToken: ApiResponse<string> = await loginUser(email, password);
    if(resToken.status === 200){
        setToken(resToken.data);
        //decode the token and retrieve userId
        const decodedToken: TokenType = decodeToken(token)!;
        let id = Number(decodedToken.upn)!
        setUserId(prev => id);
        // notify that the user is authenticated
        setIsAuthenticated(true);
        navigation("/p");

        return true;
    } else {
        return false;
    }
}
```

### 1.5 Filter Products

### Todo next 

### Data Logic
In this section we discuss how we use the data, that is fetch from the backend and rendered in the frontend, interacts. We will present the features that the corresponding data belongs to and give a detailed explanation on how the methods work. 
## 1.1 Products
#### 1.1.2 Introduction
The main data of our ecommerce app are the products. When it comes to presenting products to the client, one must fetch each product data point from a backend server and use the retrvied data accrodingly. The main concern arises when the amount of data is to large. This forces us to find efficient ways to only fetch the datapoint, that are required at a specific time of point. For our case, we don't implement yet such an efficient way, instead we retrieve all products data points at startup, because our mock data is very small in size. However, we have different uses for our products, like filtering, favorizing and ordering, which all need a specific approach to represent them.

#### 1.1.1 Sets of Products
##### 1.1.1.1 Products: 
This is the main data and comprises of the products in our backend.
```typescript
interface Product {
    id: number,
    name: string,
    description: string,
    price: number,
    categoryID: number,
    quantity: number,
    imgURL: string,
}
```
We have **2** methods to retrieve the products. The first one fetches all products available in the backend and should be reworked in future to only load bulks of data point in combination with breadcrums.

```typescript
    const fetchAndSetProducts = async() => {
        const res: ApiResponse<Product[]> = await getProducts();
        const newProducts = [...res.data];
        setProducts(newProducts);
        // trigger the filterFavoriteItems, in order to init useMemo with nonFilteredProducts
        setFavoriteItems([...favoriteItems])
    } 
```

**favoriteItems** is the result of e memiozed function and with the reset we force the favoriteItems to be applied to the newly fetched products.

The  second method to fetch the products, is to fetched only those that contain a certien substring. We specifically use a seperate function for this instead of applying it on the existing products, because we want to prepare efficient data management for large amount of data points.

```typescript
const fetchAndSetProductsByName = async (name: string) => {
        console.log("Fetch by Name; dataContext");
        if(name != ""){
            const res: ApiResponse<Product[]> = await getProductsByName(name);
            const newProducts = [...res.data];
            setProducts(newProducts);
        } else {
            fetchAndSetProducts();
        }
        // trigger the filterFavoriteItems, in order to init useMemo with nonFilteredProducts
        setFavoriteItems([...favoriteItems]);
        // filter after changing the Products
        setTriggerFilter(prev => !prev);
    }
```
If the searchtag **name** is empty, we simply fetch all products. Afterwards we trigger our filter, so we only show the filtered items from the searched ones.

Now this two methods always manipulate the main products state:

```typescript
const [products, setProducts] = useState<Product[]>([]);
```

This data will serve as base for the other methods and is exposed by the **productContext** api.

##### 1.1.1.2 FilteredProducts
 This is a subset of the products and comprises only of products that met certian condition. In our case we have **category** and **price** as filter condition.

 We use a **memiozed** approach in order to be more efficient. We declare a fucntion that will serve as a pipeline for the products. A pipeline in sense that pass the products at first through the filter method and the result will passed as input to the favoriteItems method. 

 ```typescript
 const filterProducts = useMemo(() => {
        const newProducts = products.filter( item => (
            state.category.includes(item.categoryID) &&
            item.price > state.price.minValue && 
            (state.price.maxValue > 0 
                ? (item.price < state.price.maxValue
                    ? true : false)
                    : true
        )));

        console.log("STATE ", state);
        console.log("Old: " + products + "\nNew: " + newProducts)
        return newProducts;
    },[triggerFilter])
 ```

This function will only recalculate when we force it with the **triggerFilter**. 

##### 1.1.1.3 FavoriteProducts
This is a subset of products that were favorized by a client. 

We use a set of products as input and seperate them into two groups, namley **favoriteItemsFiltered** and **nonFavoriteItems**. If out filter is activated that we will apply this to the favoriteItems , otherwise on the base products.

```typescript
const filterFavoriteItems: {
        favoriteItemsFiltered: Product[];
        nonFavoriteItems: Product[];
    } = useMemo(() => {
        console.log("Change filterFavoriteItems");
        let newProducts; 
        if(state.filter){
            console.log("IF", state.filter);
            newProducts = [...filterProducts];
        }
        else{
            console.log("ELSE", state.filter);
            newProducts = [...products];
        } 
        const [favoriteItemsFiltered, nonFavoriteItems] = newProducts.reduce<[Product[], Product[]]>(
            ([favorites, nonFavorites], item) => {
                if (favoriteItems.find(item2 => item2.productId === item.id)) {
                    favorites.push(item);
                } else {
                    nonFavorites.push(item);
                }
                return [favorites, nonFavorites];
            },
            [[], []]
        );
        
        return { favoriteItemsFiltered, nonFavoriteItems };
      
```


##### 1.1.1.4 OrderProducts[ TO BE REWORKED]
This a new Type that extends the prodcts type

```typescript
export interface OrderProduct extends Product {
    orderQuantity: number,
    orderPrice: number,
}
```

And in order to store this additional information in the database, we introduce an other interface:

```typescript
export interface OrderItemDTO {
    id: number,
    orderId: number,
    productId: number,
    quantity: number,
    price: number,
}
```

This object stores the ordered quantiy and the actual price ( after discounts etc.). Both, the products and the orderItem are stored seperatly in the database. Meaning that we need to fetch both data points and merge under the productId them into one Object. As the we make sure that the product Ids are always unique in the database and each orderItem always has a corresponding product ( because it has a foreign key dependancy), we can always make sure that the data is consistent. 

We cannot simply filter our base products depending on the orderItems, because the orderItems are meant to be represented in the cart, which is seperated from the products page. That means if we would have some arbitrary base products (e.g. because of searchTerm), we wouldn't always have all the productId's that correspond to the orderItems that we fetched. This forces us to fetch the products for the orderItems seperately. Therefore we implemented a REST endpoint exclusively to fetch all the products that are also part of the orderItems of a user. 

For now use a naive approach to make the funcitionlity work as expected. In future it is desired to implement a repository call in the backend, that fetches the merged product directly with a proper **SQL** query.

 ```typescript
const [ orderItems, setOrderItems ] = useState<OrderItemDTO[]>([]);

const fetchAndSetOrderItems = async (orderId: number) => {
    let resOrderItems: ApiResponse<OrderItemDTO[]> = await getOrderItems(orderId);
    console.log("ORderitems: ", resOrderItems)
    setOrderItems([...resOrderItems.data]);
}

//###############################################################################

const [ orderProducts,setOrderProducts ] = useState<Product[]>([]);

const fetchAndSetOrderProducts = async (orderId: number) => {
    let resOrderItems: ApiResponse<Product[]> = await getOrderItemProducts(orderId);
    console.log("ORderitems: ", resOrderItems)
    setOrderProducts([...resOrderItems.data]);
}
 ```
We use the folling orderFilter function to fetch those datapoints and merge them:

```typescript
const filterOrderItems: OrderProduct[] = useMemo(() => {
        try {
            const orderProductsMerged: OrderProduct[] = orderProducts.map(
                (orderProduct, index) => {
                    const orderItem = orderItems.find( item2 => item2.productId === orderProduct.id)!;
                    return {
                        id: orderProduct.id,
                        name: orderProduct.name,
                        description: orderProduct.description,
                        imgURL: orderProduct.imgURL,
                        price: orderProduct.price,
                        quantity: orderProduct.quantity,
                        categoryID: orderProduct.categoryID,
                        orderQuantity: orderItem.quantity,
                        orderPrice: orderItem.price,
                    }
                }
            )
            console.log("Merged: ", orderProductsMerged);
            return orderProductsMerged;

        } catch (error){
            console.error(`Not able to filter Products: ${error}`);
            throw error;
        }

    }, [triggerOrderItems]);
```

And expose it through the **orderContext** API. 

## Componets

### ProductCard

#### Component

```typescript
const ProductCard = ({ 
  product, 
  handleBuy, 
  isFavorite,
  isAuthenticated,
  addFavoriteItem,
  deleteFavoriteItem 
} : ProductCardProps ) => {
    const [modal, setModal] = useState<boolean>(false);

  const handleCartClick = () => {
    setModal(true);
  };

  const handleClose = () => {
    setModal(false);
  }

  const handleFavoriteClick = () => {
    if(isFavorite)
      deleteFavoriteItem(product.id);
    else
      addFavoriteItem(product.id);
  }

  return (
    <Card >
      <div style={{position: 'relative'}}>
        { isAuthenticated ?
        <IconButton
        sx={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'white' }}
          onClick={handleFavoriteClick}
        >
          <FavoriteIcon color={isFavorite ? 'error' : 'action'} />
        </IconButton>
        : "" }
        <ImageWithFallback src={product.imgURL} alt={product.name}/>
      </div>
      <CardContent style={{ position: 'relative' }}>
        <Typography variant="h6" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.price}€
        </Typography>
        <IconButton
          style={{ position: 'absolute', bottom: 10, right: 10, backgroundColor: 'white', border: '1px solid grey', padding: "15px" }}
          onClick={handleCartClick}
        >
          <AddShoppingCartIcon />
        </IconButton>
      </CardContent>
      <ProductModal product={product} open={modal} onClose={handleClose} handleBuy={(quantity: number) => handleBuy(product.id, product.price, quantity)}/>
    </Card>
  );
};

```
#### Props Description
The Product Card use five props to render a product on the **Products** page.
- [product](#productdto) 
    The standard product tha holds **ProductDTO** information.
- [handleBuy]()
    This function is drilled from **Products** component and it simply posts an orderItem to the backend.
- [isFavorite]()
    indicates whether this item is part of the favorite items
- [isAuthenticated]()
    indicates user authentication status. If **false**, dont render favoriteIcon
- [addFavoriteItem]()
    function from the **productContext**. It posts a favoriteItem for the user and also adds it to the local state.
- [deleteFavoriteItem]() 
    function from the **productContext**. It deltes a favoriteItem of the user and also removes it from the local state.

## Pages