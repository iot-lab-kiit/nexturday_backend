"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventDetailDto = void 0;
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
const venue_dto_1 = require("./venue.dto");
const class_transformer_1 = require("class-transformer");
require("reflect-metadata");
class EventDetailDto {
    constructor(payload) {
        if ((payload === null || payload === void 0 ? void 0 : payload.type) === 'ONLINE') {
            payload === null || payload === void 0 ? true : delete payload.venue;
        }
        Object.assign(this, payload);
    }
}
exports.EventDetailDto = EventDetailDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EventDetailDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EventDetailDto.prototype, "about", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], EventDetailDto.prototype, "from", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], EventDetailDto.prototype, "to", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(Object.keys(client_1.EventType)),
    __metadata("design:type", String)
], EventDetailDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.type === 'OFFLINE'),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => venue_dto_1.VenueDto),
    __metadata("design:type", venue_dto_1.VenueDto)
], EventDetailDto.prototype, "venue", void 0);
