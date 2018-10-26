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
const uuid_1 = require("uuid");
const json2typescript_1 = require("json2typescript");
const MemberVariableDecorator_1 = require("./MemberVariableDecorator");
let MemberVariable = class MemberVariable {
    constructor(memberVariable) {
        this.id = (memberVariable && memberVariable.id) || uuid_1.v4();
        this.name = (memberVariable && memberVariable.name) || null;
        this.type = (memberVariable && memberVariable.type) || null;
        this.isArray = (memberVariable && memberVariable.isArray) || false;
        this.decorators = (memberVariable && memberVariable.decorators) || new Array();
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
    class_validator_1.IsNotEmpty(),
    json2typescript_1.JsonProperty('id', String),
    __metadata("design:type", String)
], MemberVariable.prototype, "id", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    json2typescript_1.JsonProperty('name', String),
    __metadata("design:type", String)
], MemberVariable.prototype, "name", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    json2typescript_1.JsonProperty('type', String),
    __metadata("design:type", String)
], MemberVariable.prototype, "type", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    json2typescript_1.JsonProperty('isArray', Boolean),
    __metadata("design:type", Boolean)
], MemberVariable.prototype, "isArray", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.ValidateNested(),
    json2typescript_1.JsonProperty('decorators', [MemberVariableDecorator_1.MemberVariableDecorator]),
    __metadata("design:type", Array)
], MemberVariable.prototype, "decorators", void 0);
MemberVariable = __decorate([
    json2typescript_1.JsonObject,
    __metadata("design:paramtypes", [Object])
], MemberVariable);
exports.MemberVariable = MemberVariable;
//# sourceMappingURL=MemberVariable.js.map