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
exports.ValidationMiddleware = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const utils_1 = require("../utils");
class ValidationMiddleware {
    constructor(...validations) {
        utils_1.MethodBinder.bind(this);
        this.validations = validations;
    }
    validate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const [DtoClass, target] of this.validations) {
                    console.log(DtoClass.prototype.constructor.toString() !==
                        `class ${DtoClass.name} {\n}`);
                    const dto = DtoClass.prototype.constructor.toString() !==
                        `class ${DtoClass.name} {\n}`
                        ? new DtoClass(req[target])
                        : req[target];
                    const instance = (0, class_transformer_1.plainToInstance)(DtoClass, dto);
                    yield (0, class_validator_1.validateOrReject)(instance, { whitelist: true });
                    req[target] = instance;
                }
                next();
            }
            catch (errors) {
                if (Array.isArray(errors) && errors[0] instanceof class_validator_1.ValidationError) {
                    console.log(errors);
                    const errorMessages = this.formatValidationErrors(errors);
                    return res.status(400).json({
                        success: false,
                        message: 'Bad request exception',
                        errors: errorMessages,
                    });
                }
                next(errors);
            }
        });
    }
    formatValidationErrors(errors) {
        return errors.flatMap((error) => this.extractErrorMessages(error));
    }
    extractErrorMessages(error) {
        if (error.constraints) {
            return Object.values(error.constraints);
        }
        if (error.children && error.children.length > 0) {
            return error.children.flatMap((childError) => this.extractErrorMessages(childError));
        }
        return [];
    }
}
exports.ValidationMiddleware = ValidationMiddleware;
