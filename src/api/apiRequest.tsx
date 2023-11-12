import { ApiResponse } from "../types/ApiInterfaces";
import { ApiError } from "../types/ErrorTypes";

export enum AcceptEnum {
    'text' = 'text/plain',
    'json' = 'application/json'
}

export const apiRequest = async <T, TBody>(url: string, method: string, body?: TBody, token = '', type = AcceptEnum.json): Promise<ApiResponse<T>> => {
    try {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        if(token) {
            headers.append('Authorization', `Bearer ${token}`);
            headers.append('Accept', type);
        }

        const requestOptions = {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : null
        };

        const res: Response = await fetch(url, requestOptions);
        if(!res.ok){
            const error = new ApiError(`${method} request failed: ${res.status} ${res.statusText}`, res.status);
            throw error;
        }
        return {
            data: type === AcceptEnum.json ? await res.json() as T : await res.text() as T,
            error: null
        } 
    } catch(error) {
        if(error instanceof ApiError){
            return {
                data: null,
                error: error
            }
        } else {
            return {
                data: null,
                error: new ApiError(`Unexpected Error occurred.`, 500)
            }
        }

    }
}