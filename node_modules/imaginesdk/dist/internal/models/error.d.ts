/**
 * Represents an error object with code, details, and an error message.
 *
 * @interface Err
 * @property {number} code - The error code associated with the error.
 * @property {string[]} details - An array of additional error details or messages.
 * @property {string} error - The main error message or description.
 */
export interface Err {
    code: number;
    details: string[];
    error: string;
}
