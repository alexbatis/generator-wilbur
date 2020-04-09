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
const index_1 = require("../utils/index");
const constants_1 = require("../constants");
const ClassActionType_1 = require("../models/ClassActionType");
class ControllerService extends Generator {
    constructor(args, options, appName) {
        super(args, options);
        this.appName = appName;
        this.fileUtil = new index_1.FileUtils();
        this.useDI = true;
        this.generalUtils = new index_1.GeneralUtils(args, options);
        this.outputDirectories = constants_1.constants.generateOutputDirectories(this.destinationPath(this.appName));
        this.useDI = (typeof options.useDI === 'boolean') ? options.useDI : true;
    }
    generateController(tsClass) {
        this.tsClass = tsClass;
        this.classNameCamelCase = this.tsClass.name.charAt(0).toLowerCase() + this.tsClass.name.substring(1);
        this.generateControllerFile();
        this.generateValidatorFile();
        this.updateControllerIndexFile(ClassActionType_1.ClassActionType.ADD_EDIT);
        if (!this.useDI) {
            this.updateRoutesFile(ClassActionType_1.ClassActionType.ADD_EDIT);
            this.generateRouterFile();
        }
    }
    removeController(tsClass) {
        return __awaiter(this, void 0, void 0, function* () {
            this.tsClass = tsClass;
            this.classNameCamelCase = this.tsClass.name.charAt(0).toLowerCase() + this.tsClass.name.substring(1);
            yield this.removeControllerFiles();
            this.updateControllerIndexFile(ClassActionType_1.ClassActionType.REMOVE);
            this.updateRoutesFile(ClassActionType_1.ClassActionType.REMOVE);
        });
    }
    removeControllerFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const controllerDirectory = this.outputDirectories.controller.base + "/" + this.classNameCamelCase;
            this.fileUtil.removeDirectory(controllerDirectory);
        });
    }
    generateControllerFile() {
        const templatePath = this.generalUtils.directories.templates.controller;
        this.fs.copyTpl((this.useDI) ? templatePath.inversify : templatePath.controller, this.outputDirectories.controller.base + "/" + this.classNameCamelCase + '/' + this.classNameCamelCase + ".controller.ts", { tsClass: this.tsClass });
    }
    generateRouterFile() {
        this.fs.copyTpl(this.generalUtils.directories.templates.controller.router, this.outputDirectories.controller.base + "/" + this.classNameCamelCase + '/' + this.classNameCamelCase + ".router.ts", { tsClass: this.tsClass });
    }
    generateValidatorFile() {
        this.fs.copyTpl(this.generalUtils.directories.templates.controller.validator, this.outputDirectories.controller.base + "/" + this.classNameCamelCase + '/' + this.classNameCamelCase + ".validator.ts", { tsClass: this.tsClass });
    }
    updateControllerIndexFile(actionType) {
        let fileContents = this.fs.read(this.outputDirectories.controller.index);
        let importContent = `// ${this.tsClass.name.toUpperCase()}\nexport * from "./${this.classNameCamelCase}/${this.classNameCamelCase}.validator";\nexport * from "./${this.classNameCamelCase}/${this.classNameCamelCase}.controller";`;
        if (!this.useDI)
            importContent = `${importContent}\nexport * from "./${this.classNameCamelCase}/${this.classNameCamelCase}.router";`;
        if (actionType === ClassActionType_1.ClassActionType.ADD_EDIT) {
            if (fileContents.indexOf(importContent) === -1)
                fileContents += `\n${importContent}`;
        }
        else
            fileContents = fileContents.replace(importContent, "");
        this.fs.write(this.outputDirectories.controller.index, fileContents);
    }
    updateRoutesFile(actionType) {
        let fileContents = this.fs.read(this.outputDirectories.controller.routes);
        const classRouter = `${this.tsClass.name}Router`;
        const classRouterLine = `,\n  ${classRouter}`;
        const routerLine = `\n  app.use("/api/v1/${this.classNameCamelCase.toLocaleLowerCase()}s", ${classRouter});`;
        if (actionType == ClassActionType_1.ClassActionType.ADD_EDIT) {
            if (fileContents.indexOf(classRouter) === -1) {
                const indexToAddImport = fileContents.indexOf(`} from "@controllers";`) - 1;
                fileContents = fileContents.slice(0, indexToAddImport) + classRouterLine + fileContents.slice(indexToAddImport);
                const indexToAddRoute = fileContents.lastIndexOf(`};`) - 1;
                fileContents = fileContents.slice(0, indexToAddRoute) + routerLine + fileContents.slice(indexToAddRoute);
            }
        }
        else {
            fileContents = fileContents.replace(classRouterLine, "");
            fileContents = fileContents.replace(routerLine, "");
        }
        this.fs.write(this.outputDirectories.controller.routes, fileContents);
    }
}
exports.ControllerService = ControllerService;
//# sourceMappingURL=controller.service.js.map