export class AppError extends Error {
    constructor(message, statusCode=500, code= 'INTERNAL_SERVER_ERROR') {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor)
    }
}

export class BrowserLaunchError extends AppError {
    constructor(message) {
        super(message, 500, 'BROWSER_LAUNCH_ERROR');
    }
}