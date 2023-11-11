# Ecommerce Frontend Documentation

## Content

1. [Product Management](#product-management)

## Product Management

### 1.1 Overview
The product management module is responsible for fetching, filtering, and displaying product data to users. It involves integration with backend APIs to retrieve product information and client-side logic to filter products based on user preferences and display favorite products.

### 1.2 Components

#### 1.2.1 Product Context(`ProductContext`):

- Purpose: Manages the global state of product data.
- Key Functinos:
    - `fetchProducts`: Fetches the complete list of products.
    - `fetchProductsByName`: Fetches products based on a search query.
    - `filteredProducts`: Filters the products based on `filterConditions`.
    - `favoriteProductFiltered`: Catogorizes products into favorite and non-favorite.
- Data Flow: 
    `products` server as base data. `useProductFilter` filters the products and holds the result in `filteredProducts`. `filteredProducts` are then past to `useFavoriteProducts` and are then seperated into two pools `favoriteProducts` and `nonFavoriteProduct`.

### 1.2.2 useProductApi Hook
- Functionality: Handles API calls to fetch products.
- Usage:
```typescript
    const { products, loading, error } = useProductApi();
```

### 1.2.3 useProductFilter Hook
- Funcionality: Filters the product list based on user selected criteria.
- Example:
```typescript
    const { favoriteProducts } = useProductFilter(products);
```

### 1.2.4 useFavoriteProducts Hook
- Functionality: Seperates products into favorites and non-favorites. It is applies on the filtered products.
- Example:
```typescript
    const { favoriteProductsFiltered } = useFavoriteProducts(filteredProducts);
```