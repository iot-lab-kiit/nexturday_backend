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
exports.HomeService = void 0;
const auth_1 = require("firebase-admin/auth");
const firebase_1 = require("../libs/firebase");
class HomeService {
    constructor() {
        this.firebaseProvider = firebase_1.FirebaseProvider;
    }
    welcome(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const userInfo = yield (0, auth_1.getAuth)(this.firebaseProvider.firebase).verifyIdToken(token);
            return userInfo;
        });
    }
}
exports.HomeService = HomeService;
