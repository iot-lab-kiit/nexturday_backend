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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginService = void 0;
const client_1 = require("@prisma/client");
const utils_1 = require("../../utils");
const bcrypt_1 = __importDefault(require("bcrypt"));
class LoginService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    checkLogin(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = dto;
            const society = yield this.prisma.society.findFirst({
                where: {
                    email,
                },
            });
            if (!society) {
                throw new utils_1.CustomError("society doesn't exist", 400);
            }
            const isPasswordValid = yield bcrypt_1.default.compare(password, society.password);
            if (!isPasswordValid) {
                throw new utils_1.CustomError('Invalid password', 400);
            }
            return {
                success: true,
                message: 'Logged in successfully',
                data: society,
            };
        });
    }
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const saltRounds = 10;
            return yield bcrypt_1.default.hash(password, saltRounds);
        });
    }
}
exports.LoginService = LoginService;
