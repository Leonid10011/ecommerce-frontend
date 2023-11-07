# Ecommerce Frontend Docs

## Content
1. [Feature Overvire](#feature-overview)
    1. [Favorite Items](#11-favorite-items)
## Feature Overview

In this Sectio we will give a detailed introductions of various features of this app.

### 1.1 Favorite Items

#### Favorite Item DTO
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