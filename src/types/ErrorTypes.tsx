/**
 * Contains `status` as the HTTP Code and `name` of the error.
 */
export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number){
        super(message);
        this.status = status;
        this.name = 'ApiError'
    }
}