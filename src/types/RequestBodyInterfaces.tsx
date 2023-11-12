/**
 * @typedef {Object} SignUpRequestBody
 * @property {string} username - The username for the new user account.
 * @property {string} email - The email address associated with the new user account.
 * @property {number} roleId - The role identifier for the new user account.
 * @property {string} password - The password for the new user account.
 */
export interface SignUpRequestBody {
    username: string,
    email: string,
    roleId: number,
    password: string
}
/**
 * @typedef {Object} LoginRequestBody
 * @property {string} username - The username of the user attempting to log in.
 * @property {string} password - The password of the user attempting to log in.
 */
export interface LoginRequestBody {
    username: string,
    password: string,
}
/**
 * @typedef {Object} CreateFavoriteItemBody
 * @property {number} userId - The unique identifier of the user who is favoriting the product.
 * @property {number} productId - The unique identifier of the product being added to favorites.
 */
export interface CreateFavoriteItemBody {
    userId: number,
    productId: number
}
/**
 * @typedef {Object} CreateOrderBody
 * @property {number} userId - The unique identifier of the user creating the order.
 * @property {Date} date - The date when the order is created.
 * @property {string} status - The current status of the order.
*/
export interface CreateOrderBody {
    userId: number,
    date: Date,
    status: string
}
/**
 * @typedef {Object} AddItemBody
 * @property {number} orderId - The unique identifier of the item that is added
 * @property {number} productId - The unique identifier of the product being added
 * @property {number} quantity - The number of products being ordered
 * @property {number} price - The final price of the ordered product
 */
export interface AddItemBody {
    orderId: number,
    productId: number,
    quantity: number,
    price: number
}
