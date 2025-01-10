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
exports.LoginController = void 0;
const utils_1 = require("../../utils");
const class_transformer_1 = require("class-transformer");
const login_1 = require("../../services/login");
const login_2 = require("../../common/dtos/login");
class LoginController {
    constructor() {
        utils_1.MethodBinder.bind(this);
        this.loginService = new login_1.LoginService();
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dto = (0, class_transformer_1.plainToInstance)(login_2.loginDto, Object.assign({}, req.body));
                const result = yield this.loginService.checkLogin(dto);
                res.status(201).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    signup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dto = (0, class_transformer_1.plainToInstance)(login_2.signupDto, Object.assign({}, req.body));
                const result = yield this.signupService.societySignup(dto);
                res.status(201).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.LoginController = LoginController;
