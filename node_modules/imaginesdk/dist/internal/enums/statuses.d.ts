/**
 * @enum {number} Status - The status codes for API responses.
 */
export declare enum Status {
    OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    UNPROCESSABLE_ENTITY = 422,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503,
    PAYMENT_REQUIRED = 402,
    NOT_ENOUGH_TOKENS = 424
}
export default Status;
