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

When we want to show the favorite products of a use, we filter the products simply by the corresponding id.

In the products list, we always show the favorite products on top of the list. This allow us to simply show the favorite products followed by the remaining products. Otherwise we would need to check each product in the list if it is part of the favorite products and this would create unnecessary overhead.

If we click on the favorite icon on product in the list, we retrieve the product id and together with the user id we post a new favoriteItem entry in the database. We also append it localy to the favoriteItems state, so we don't have to refetch the updated set of favoriteItems. For removing an Item we proceed in the same way.

