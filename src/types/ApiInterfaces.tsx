import { ApiError } from "./ErrorTypes";

/**
 * Enum for standard HTTP status codes.
 */
enum HttpStatusCode {
    OK = 200,
    Created = 201,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    Conflict = 409,
    InternalServerError = 500,
}

/**
 * Represents a standard API response with a generic type.
 * 
 * @param data The payload of the response, of generic type T.
 * @param error Any error that occurred during the API call.
 */
interface ApiResponse<T> {
    data: T | null,
    error: ApiError | null,
}

/**
 * Represents a success response from an API.
 * 
 * @param message A success message.
 */
interface ApiSuccessResponse {
    message: string
}

/**
 * Represents a user entity.
 * 
 * @param id The unique identifier for the user.
 * @param username The username of the user.
 * @param email The email address of the user.
 * @param roleId The role ID associated with the user.
 */
interface User {
    id: number,
    username: string,
    email: string,
    roleId: number
}

/**
 * Represents a product entity.
 * 
 * @param id The unique identifier for the product.
 * @param name The name of the product.
 * @param description A description of the product.
 * @param price The price of the product.
 * @param categoryID The category ID to which the product belongs.
 * @param quantity The available quantity of the product.
 * @param imgURL The URL of the product image.
 */
interface Product {
    id: number,
    name: string,
    description: string,
    price: number,
    categoryID: number,
    quantity: number,
    imgURL: string,
}

/**
 * Represents a Data Transfer Object for a user.
 * 
 * @param id The unique identifier for the user.
 * @param username The username of the user.
 * @param email The email address of the user.
 * @param roleId The role ID associated with the user.
 * @param password The password of the user.
 */
interface UserDTO {
    id: number,
    username: string,
    email: string,
    roleId: number,
    password: string,
}

/**
 * Represents the structure of a JWT token.
 * 
 * @param sub The subject of the token.
 * @param groups The groups or roles associated with the token.
 * @param upn The User Principal Name.
 * @param iat Issued at time (timestamp).
 * @param exp Expiration time (timestamp).
 * @param jti JWT ID.
 */
interface TokenInterface {
    sub: string,
    groups: string[],
    upn: string,
    iat: number,
    exp: number,
    jti: string
}

/**
 * Represents an order entity.
 * 
 * @param id The unique identifier for the order.
 * @param userId The ID of the user who created the order.
 * @param date The date the order was created.
 * @param status The status of the order.
 */
interface Order {
    id: number,
    userId: number,
    date: Date,
    status: string
}

/**
 * Represents a Data Transfer Object for an order item.
 * 
 * @param id The unique identifier for the order item.
 * @param orderId The ID of the order to which this item belongs.
 * @param productId The ID of the product in the order item.
 * @param quantity The quantity of the product ordered.
 * @param price The price of the product at the time of order.
 */
interface OrderItemDTO {
    id: number,
    orderId: number,
    productId: number,
    quantity: number,
    price: number,
}

/**
 * Represents a favorite product entity.
 * 
 * @param id The unique identifier for the favorite product entry.
 * @param userId The ID of the user who marked the product as favorite.
 * @param productId The ID of the product marked as favorite.
 */
interface FavoriteProduct {
    id: number,
    userId: number,
    productId: number
}

/**
 * Represents a response DTO for an order item, including product details.
 * 
 * @param orderItemId The unique identifier for the order item.
 * @param orderId The ID of the order.
 * @param productId The ID of the product.
 * @param productName The name of the product.
 * @param productDescription A description of the product.
 * @param categoryId The category ID of the product.
 * @param imageURL The URL of the product's image.
 * @param orderedQuantity The quantity of the product ordered.
 * @param orderedPrice The price of the product at the time of order.
 */
interface OrderItemResponseDTO {
    orderItemId: number,
    orderId: number,
    productId: number,
    productName: string,
    productDescription: string,
    categoryId: number,
    imageURL: string,
    orderedQuantity: number,
    orderedPrice: number,
}
/**
 * Represents a DTO for an order, including user id, creation date and a status message
 * @param id The unique identifier of order
 * @param userId The unique identifier of the corresponding user
 * @param date The creation time stamp of the order
 * @param status A message providing information on the current status of the order
 */
interface OrderDTO {
    id: number,
    userId: number,
    date: Date,
    status: string,
}
/**
 * Represent a request DTO of an order item, including order and product information
 * @param id The unique identifier of the order item 
 * @param orderId The ID of the order this item belongs to
 * @param productId The ID of the product
 * @param quantity The number of products ordered
 * @param price The final price of the product
 */
interface OrderItemRequestDTO {
    id: number,
    orderId: number,
    productId: number,
    quantity: number,
    price: number,
}

export type {
    HttpStatusCode,
    ApiResponse,
    ApiSuccessResponse,
    User,
    Product,
    UserDTO,
    TokenInterface,
    Order,
    OrderItemDTO,
    FavoriteProduct,
    OrderItemResponseDTO,
    OrderDTO,
    OrderItemRequestDTO,
}