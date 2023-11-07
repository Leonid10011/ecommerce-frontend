# Ecommerce Frontend Docs

## Content
1. [Feature Overvire](#feature-overview)
    1. [Products](#11-products)
    2. [Favorite Items](#12-favorite-items)
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
    let res = await getProducts();
    setProducts(res.data);

    if(favoriteItems.length === 0)
        setFavoriteItems([])
}

// When the productContext is loaded we fetch the products
useEffect(() => {
    fetchAndSetProducts();
}, [])
```

Additionally we also can fetch the products that only contain a specific substring. We avoid filtering the existing products in the state because it could create an overhead if the number of products is to large.

```typescript
const fetchAndSetProductsByName = async (name: string, userId: number, token: string) => {
    const res: ApiResponse<Product[]> = await getProductsByName(name);
    setProducts(res.data);

    if(favoriteItems.length === 0)
        setFavoriteItems([]);
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