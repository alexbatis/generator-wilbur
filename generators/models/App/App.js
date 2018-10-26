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
const Author_1 = require("./Author");
const Class_1 = require("../Class/Class");
let App = class App {
    constructor(app) {
        this.id = (app && app.id) || uuid_1.v4();
        this.appName = (app && app.appName) || null;
        this.description = (app && app.description) || null;
        this.generateAngularProject = (app && app.generateAngularProject) || false;
        this.author = (app && app.author) || new Author_1.Author();
        this.classes = (app && app.classes) || new Array();
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
    json2typescript_1.JsonProperty('id', String),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], App.prototype, "id", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    json2typescript_1.JsonProperty('appName', String),
    __metadata("design:type", String)
], App.prototype, "appName", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    json2typescript_1.JsonProperty('description', String),
    __metadata("design:type", String)
], App.prototype, "description", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsDefined(),
    json2typescript_1.JsonProperty('generateAngularProject', Boolean),
    __metadata("design:type", Boolean)
], App.prototype, "generateAngularProject", void 0);
__decorate([
    class_validator_1.IsDefined(),
    class_validator_1.ValidateNested(),
    json2typescript_1.JsonProperty('author', Author_1.Author),
    __metadata("design:type", Author_1.Author)
], App.prototype, "author", void 0);
__decorate([
    json2typescript_1.JsonProperty('classes', [Class_1.Class]),
    class_validator_1.ValidateNested(),
    __metadata("design:type", Array)
], App.prototype, "classes", void 0);
App = __decorate([
    json2typescript_1.JsonObject,
    __metadata("design:paramtypes", [Object])
], App);
exports.App = App;
//# sourceMappingURL=App.js.map