class ErrorHandler extends Error {
    constructor(message,statusCode ) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    if(err.code === 11000){
        //this is a duplicate key error
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message,400);
    }
    //this is a validation error
    if(err.name === "JsonWebTokenError"){
        const message = "Invalid token. Please try again";
        err = new ErrorHandler(message,400);
    }
    //this is a validation error
    if(err.name === "TokenExpiredError"){
        const message = "Json web token is expired. Please try again";
        err = new ErrorHandler(message,400);
    }
    //this is a validation error
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message,400);
    }

    //this is to give exact error message
    const errorMessage = err.errors ? Object.values(err.errors).map(error => error.message).join("  ") : err.message;

    return res.status(err.statusCode).json({
        success : false,
        message : errorMessage
    });
}

export default ErrorHandler;