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
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
require("dotenv/config");
const server_1 = require("./src/server");
const app = (0, express_1.default)();
new server_1.Server(app);
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
const prisma = new client_1.PrismaClient();
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma.$connect();
            console.log('Database connected successfully.');
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}.`);
            });
        }
        catch (error) {
            console.error('Failed to connect to the database:', error);
        }
    });
}
startServer();
app.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log('Error: address already in use');
    }
    else {
        console.log(err);
    }
});
