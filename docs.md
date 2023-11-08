# Ecommerce Frontend Docs

## Content
1. [Feature Overview](#feature-overview)
    1. [Products](#11-products)
    2. [Favorite Items](#12-favorite-items)
    3. [Orders and OrderItems](#13-order)
    4. [User Management](#14-user-management)
2. [Components](#componets)
    1. [Product Card](#productcard)
3. [Pages](#pages)

## Feature Overview

In this Sectio we will give a detailed introductions of various features of this app.

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