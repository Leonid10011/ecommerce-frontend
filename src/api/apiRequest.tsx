import { ApiResponse } from "../types/ApiInterfaces";
import { ApiError } from "../types/ErrorTypes";

/**
 * Enumeration for specifying the 'Accept' header in API requests.
 */
export enum AcceptEnum {
    'text' = 'text/plain',
    'json' = 'application/json'
}

/**
 * Generic function for making API requests.
 * 
 * @param url - The URL of the API endpoint.
 * @param method - The HTTP method to be used for the request.
 * @param body - The request body, if applicable.
 * @param token - The authorization token, if required.
 * @param type - The response type expected ('json' or 'text'), defaults to 'json'.
 * @returns A promise that resolves to an ApiResponse containing either data or an error.
 */
export const apiRequest = async <T, TBody>(
    url: string, 
    method: string, 
    body?: TBody, 
    token = '', 
    type = AcceptEnum.json
): Promise<ApiResponse<T>> => {
    try {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        if (token) {
            headers.append('Authorization', `Bearer ${token}`);
            headers.append('Accept', type);
        }

        const requestOptions = {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : null
        };

        const res: Response = await fetch(url, requestOptions);
        if (!res.ok) {
            const error = new ApiError(`${method} request failed: ${res.status} ${res.statusText}`, res.status);
            throw error;
        }
        return {
            data: type === AcceptEnum.json ? await res.json() as T : await res.text() as T,
            error: null
        };
    } catch (error) {
        if (error instanceof ApiError) {
            return {
                data: null,
                error: error
            };
        } else {
            return {
                data: null,
                error: new ApiError(`Unexpected Error occurred.`, 500)
            };
        }
    }
};
