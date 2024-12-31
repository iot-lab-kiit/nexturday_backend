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
exports.RoleMiddleware = void 0;
const utils_1 = require("../../utils");
class RoleMiddleware {
    constructor(...roles) {
        utils_1.MethodBinder.bind(this);
        this.roles = roles;
    }
    verify(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authorized = this.roles.some((role) => { var _a; return ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === role; });
                if (!authorized) {
                    throw new utils_1.CustomError('Unauthorized Exception', 401);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.RoleMiddleware = RoleMiddleware;
