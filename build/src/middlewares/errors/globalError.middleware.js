"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalErrorMiddleware = void 0;
class GlobalErrorMiddleware {
    static handle(err, req, res, next) {
        console.log(err);
        const status = err.status || err.statusCode || 500;
        const message = err.message || 'Internal server error';
        res.status(status).json({
            success: false,
            message,
        });
    }
}
exports.GlobalErrorMiddleware = GlobalErrorMiddleware;
