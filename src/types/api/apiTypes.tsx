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
    data: T,
    status: HttpStatusCode
}