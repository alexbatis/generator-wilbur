"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Generator = require("yeoman-generator");
const index_1 = require("../models/index");
const index_2 = require("../utils/index");
const constants_1 = require("../constants");
const swagger_service_1 = require("./swagger.service");
const ClassActionType_1 = require("../models/ClassActionType");
const controller_service_1 = require("./controller.service");
const service_service_1 = require("./service.service");
class ClassService extends Generator {
    constructor(args, options, appName) {
        super(args, options);
        this.appName = appName;
        this.fileUtil = new index_2.FileUtils();
        if (!appName)
            this.appName = '';
        this.generalUtils = new index_2.GeneralUtils(args, options);
        this.outputDirectories = constants_1.constants.generateOutputDirectories(this.destinationPath(this.appName));
        this.swaggerService = new swagger_service_1.SwaggerService(args, options, this.appName);
        this.controllerService = new controller_service_1.ControllerService(args, options, this.appName);
        this.serviceService = new service_service_1.ServiceService(args, options, this.appName);
    }
    generateClass(tsClass) {
        return __awaiter(this, void 0, void 0, function* () {
            this.tsClass = tsClass;
            this.generateClassFromTemplate();
            this.updateClassIndexFile(ClassActionType_1.ClassActionType.ADD_EDIT);
            this.swaggerService.addSwaggerDocs(tsClass);
            this.controllerService.generateController(tsClass);
            this.serviceService.generateService(tsClass);
            return true;
        });
    }
    removeClass(tsClassName) {
        return __awaiter(this, void 0, void 0, function* () {
            this.tsClass = new index_1.Class();
            this.tsClass.name = tsClassName;
            yield this.removeClassFiles();
            yield this.controllerService.removeController(this.tsClass);
            yield this.serviceService.removeService(this.tsClass);
            yield this.swaggerService.removeSwaggerDocs(this.tsClass);
            this.updateClassIndexFile(ClassActionType_1.ClassActionType.REMOVE);
        });
    }
    generateClassFromTemplate() {
        this.fs.copyTpl(this.generalUtils.directories.templates.classBase + "/class.ts", this.outputDirectories.models.mongo + "/" + this.tsClass.name + ".ts", { model: this.tsClass });
    }
    removeClassFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const modelDirectory = this.outputDirectories.models.mongo + "/" + this.tsClass.name + ".ts";
            this.fileUtil.removeDirectory(modelDirectory);
        });
    }
    updateClassIndexFile(actionType) {
        let fileContents = this.fs.read(this.outputDirectories.models.mongoIndexFile);
        const className = this.tsClass.name.charAt(0).toUpperCase() + this.tsClass.name.substring(1);
        const importContent = `export * from "./${className}";`;
        if (actionType === ClassActionType_1.ClassActionType.ADD_EDIT) {
            if (fileContents.indexOf(importContent) === -1)
                fileContents += `\n${importContent}`;
        }
        else
            fileContents = fileContents.replace(importContent, "");
        this.fs.write(this.outputDirectories.models.mongoIndexFile, fileContents);
    }
}
exports.ClassService = ClassService;
//# sourceMappingURL=class.service.js.map