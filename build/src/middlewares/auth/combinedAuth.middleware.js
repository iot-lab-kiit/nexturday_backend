"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombinedAuthMiddleware = void 0;
const utils_1 = require("../../utils");
const firebase_middleware_1 = require("./firebase.middleware");
const jwt_middleware_1 = require("./jwt.middleware");
class CombinedAuthMiddleware {
    constructor() {
        utils_1.MethodBinder.bind(this);
        this.firebaseMiddleware = new firebase_middleware_1.FirebaseMiddleware();
        this.jwtMiddleware = new jwt_middleware_1.JWTMiddleware();
    }
    verify(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.firebaseMiddleware.verify(req, res, next);
                return;
            }
            catch (firebaseError) {
                try {
                    this.jwtMiddleware.verify(req, res, next);
                    return;
                }
                catch (jwtError) {
                    return res.status(401).json({ message: 'Unauthorized Exception' });
                }
            }
        });
    }
}
exports.CombinedAuthMiddleware = CombinedAuthMiddleware;
