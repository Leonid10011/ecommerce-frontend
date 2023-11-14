import { config } from "../config";
import { ApiResponse, ApiSuccessResponse, RatingDTO } from "../types/ApiInterfaces";
import { AcceptEnum, apiRequest } from "./apiRequest";

const apiPath = config.api_path;

/**
 * Creates a rating for a product by a user.
 * @param ratingDTO The rating values that need to be stored.
 * @returns Promise<ApiResponse<RatingDTO>> A Promise that resolves to an ApiResponse,
 * containing either th created Response or error object.
 */
const createRating = async (ratingDTO: RatingDTO): Promise<ApiResponse<RatingDTO>> => {
    const url = `${apiPath}/rating/`; 
    return apiRequest(url, 'POST', ratingDTO, undefined, AcceptEnum.json);
}
/**
 * Retrieves all ratings for a user.
 * @param userId The unique identifier of an user.
 * @returns Promise<ApiResponse<RatingDTO>> - Return a Promise that resolves to the found list of ratings,
 * or an error object.
 */
const getRatingsByUser = async(userId: number): Promise<ApiResponse<RatingDTO[]>> => {
    const url = `${apiPath}/rating/get_user/${userId}`;
    return apiRequest(url, 'GET', undefined, '', AcceptEnum.json);
}
/**
 * Retrieves all ratings for a product.
 * @param userId The unique identifier of a product.
 * @returns Promise<ApiResponse<RatingDTO>> - Return a Promise that resolves to the found list of ratings,
 * or an error object.
 */
const getRatingsByProduct = async(productId: number): Promise<ApiResponse<RatingDTO[]>> => {
    const url = `${apiPath}/rating/get_product/${productId}`;
    return apiRequest(url, 'GET', undefined, '', AcceptEnum.json);
}
/**
 * Updates the rating value of the rating.
 * @param ratingDTO The data transfer object that contains all needed information to update.
 * @returns Promise<ApiResponse<RatingDTO>> A Promise that resolves to an ApiResponse,
 * containing either the updated rating or error object.
 */
const updateRatingValue = async (ratingDTO: RatingDTO): Promise<ApiResponse<RatingDTO>> => {
    const url = `${apiPath}/rating/updateRatingValue`; 
    return apiRequest(url, 'PUT', ratingDTO, undefined, AcceptEnum.json);
}

/**
 * Updates the rating text of the rating.
 * @param ratingDTO The data transfer object that contains all needed information to update.
 * @returns Promise<ApiResponse<RatingDTO>> A Promise that resolves to an ApiResponse,
 * containing either the updated rating or error object.
 */
const updateRatingText = async (ratingDTO: RatingDTO): Promise<ApiResponse<RatingDTO>> => {
    const url = `${apiPath}/rating/updateRatingText`; 
    return apiRequest(url, 'PUT', ratingDTO, undefined, AcceptEnum.json);
}

/**
 * Deletes the rating with the given id.
 * @param ratingId The unique identifier of the rating object.
 * @returns Promise<ApiResponse<RatingDTO>> A Promise that resolves to an ApiResponse,
 * containing either a success message or an error object.
 */
const deleteRating = async (ratingId: number): Promise<ApiResponse<ApiSuccessResponse>> => {
    const url = `${apiPath}/rating/updateRatingValue/${ratingId}`; 
    return apiRequest(url, 'PUT', undefined, undefined, AcceptEnum.text);
}

export {
    createRating,
    getRatingsByProduct,
    getRatingsByUser,
    updateRatingText,
    updateRatingValue,
    deleteRating,
}

