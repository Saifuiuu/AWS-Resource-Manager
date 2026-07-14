const errorHandler = (err, req, res, next) => {
    // Console log the error
    console.error(`[ERROR]: ${err.message}`);
    
    // Bulletproof Status Code Logic
    // Agar res.statusCode undefined ya valid number nahi hai, toh force 500 (Server Error)
    let statusCode = res.statusCode;
    
    if (!statusCode || !Number.isInteger(statusCode) || statusCode === 200) {
        statusCode = 500;
    }

    // Ab error ki wajah se application dobara crash nahi hogi
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export default errorHandler;