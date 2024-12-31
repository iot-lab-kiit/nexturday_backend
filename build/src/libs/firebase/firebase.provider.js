"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseProvider = void 0;
const firebase_admin_1 = require("firebase-admin");
const app_1 = require("firebase-admin/app");
require("dotenv/config");
class Firebase {
    constructor() {
        // const CERT = JSON.parse(process.env.PRIVATE_KEY as string).key;
        const CERT = process.env.PRIVATE_KEY;
        console.log(CERT);
        this.firebase = (0, app_1.initializeApp)({
            credential: firebase_admin_1.credential.cert({
                projectId: process.env.PROJECT_ID,
                privateKey: CERT,
                clientEmail: process.env.CLIENT_EMAIL,
            }),
        });
    }
}
exports.FirebaseProvider = new Firebase();
