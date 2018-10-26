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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("class-validator");
const json2typescript_1 = require("json2typescript");
let Author = class Author {
    constructor(author) {
        this.name = (author && author.name) || null;
        this.email = (author && author.email) || null;
        this.github = (author && author.github) || null;
    }
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = yield class_validator_1.validate(this);
            if (errors.length)
                throw errors;
            return true;
        });
    }
};
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    json2typescript_1.JsonProperty('name', String),
    __metadata("design:type", String)
], Author.prototype, "name", void 0);
__decorate([
    class_validator_1.IsEmail(),
    class_validator_1.IsNotEmpty(),
    json2typescript_1.JsonProperty('email', String),
    __metadata("design:type", String)
], Author.prototype, "email", void 0);
__decorate([
    class_validator_1.IsString(),
    json2typescript_1.JsonProperty('github', String),
    __metadata("design:type", String)
], Author.prototype, "github", void 0);
Author = __decorate([
    json2typescript_1.JsonObject,
    __metadata("design:paramtypes", [Object])
], Author);
exports.Author = Author;
//# sourceMappingURL=Author.js.map