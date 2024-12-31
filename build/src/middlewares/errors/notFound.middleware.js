"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundMiddleware = void 0;
class NotFoundMiddleware {
    static handle(req, res, next) {
        res.status(404).json({
            success: false,
            path: req.path,
            message: 'requested resource could not be found',
        });
    }
}
exports.NotFoundMiddleware = NotFoundMiddleware;
