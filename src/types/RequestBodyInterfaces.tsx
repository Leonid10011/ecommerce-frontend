/**
 * Represents the request body for signing up a new user.
 * 
 * @param username The username of the new user.
 * @param email The email address of the new user.
 * @param roleId The role ID associated with the new user.
 * @param password The password for the new user's account.
 */
export interface SignUpRequestBody {
    username: string,
    email: string,
    roleId: number,
    password: string
}

/**
 * Represents the request body for a user login.
 * 
 * @param username The username of the user trying to log in.
 * @param password The password of the user trying to log in.
 */
export interface LoginRequestBody {
    username: string,
    password: string,
}

/**
 * Represents the request body for creating a favorite item.
 * 
 * @param userId The ID of the user who is favoriting the product.
 * @param productId The ID of the product being added to favorites.
 */
export interface CreateFavoriteItemBody {
    userId: number,
    productId: number
}

/**
 * Represents the request body for creating an order.
 * 
 * @param userId The ID of the user creating the order.
 * @param date The date when the order is created.
 * @param status The status of the order.
 */
export interface CreateOrderBody {
    userId: number,
    date: Date,
    status: string
}

/**
 * Represents the request body for adding an item to an order.
 * 
 * @param orderId The ID of the order to which the item is being added.
 * @param productId The ID of the product being added to the order.
 * @param quantity The quantity of the product being ordered.
 * @param price The price of the product at the time of ordering.
 */
export interface AddItemBody {
    orderId: number,
    productId: number,
    quantity: number,
    price: number
}
