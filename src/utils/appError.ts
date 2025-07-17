class AppError extends Error {
    statusCode: number;
    success: boolean;
    errors: string[];
    data: null;
    constructor(message = "Something went wrong", statusCode: number, errors = [], stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.errors = errors;
        this.data = null;
        this.message = message
        if (stack) {
            this.stack = stack
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default AppError