import { ApiError } from "./ErrorTypes";

export enum HttpStatusCode {
    OK = 200,
    created = 201,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    Conflict = 409,
    InternalServerError = 500,
}

export interface ApiResponse<T> {
    data: T | null,
    error: ApiError | null,
} 

export interface User {
    id: number,
    username: string,
    email: string,
    roleId: number
}

export interface UserDTO {
    id: number,
    username: string,
    email: string,
    roleId: number,
    password: string,
}