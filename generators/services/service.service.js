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
class ServiceService extends Generator {
    constructor(args, options, appName) {
        super(args, options);
        this.appName = appName;
        this.fileUtil = new index_1.FileUtils();
        this.useDI = true;
        this.generalUtils = new index_1.GeneralUtils(args, options);
        this.outputDirectories = constants_1.constants.generateOutputDirectories(this.destinationPath(this.appName));
        this.useDI = (typeof options.useDI === 'boolean') ? options.useDI : true;
    }
    generateService(tsClass) {
        this.tsClass = tsClass;
        this.classNameCamelCase = this.tsClass.name.charAt(0).toLowerCase() + this.tsClass.name.substring(1);
        this.generateServiceFile();
        this.updateServiceIndexFile(ClassActionType_1.ClassActionType.ADD_EDIT);
        this.updateDIContainer(ClassActionType_1.ClassActionType.ADD_EDIT);
    }
    removeService(tsClass) {
        return __awaiter(this, void 0, void 0, function* () {
            this.tsClass = tsClass;
            this.classNameCamelCase = this.tsClass.name.charAt(0).toLowerCase() + this.tsClass.name.substring(1);
            yield this.removeServiceFiles();
            this.updateServiceIndexFile(ClassActionType_1.ClassActionType.REMOVE);
            this.updateDIContainer(ClassActionType_1.ClassActionType.REMOVE);
        });
    }
    removeServiceFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const serviceDirectory = this.outputDirectories.service.base + "/" + this.classNameCamelCase;
            this.fileUtil.removeDirectory(serviceDirectory);
        });
    }
    generateServiceFile() {
        const templatePath = this.generalUtils.directories.templates.service;
        this.fs.copyTpl((this.useDI) ? templatePath.inversify : templatePath.service, this.outputDirectories.service.base + "/" + this.classNameCamelCase + '/' + this.classNameCamelCase + ".service.ts", { tsClass: this.tsClass });
    }
    updateServiceIndexFile(actionType) {
        let fileContents = this.fs.read(this.outputDirectories.service.index);
        const importContent = `// ${this.tsClass.name.toUpperCase()}\nexport * from "./${this.classNameCamelCase}/${this.classNameCamelCase}.service";`;
        if (actionType === ClassActionType_1.ClassActionType.ADD_EDIT) {
            if (fileContents.indexOf(importContent) === -1)
                fileContents += `\n${importContent}`;
        }
        else {
            fileContents = fileContents.replace(importContent, "");
        }
        this.fs.write(this.outputDirectories.service.index, fileContents);
    }
    updateDIContainer(actionType) {
        console.log('sup');
        if (!this.useDI)
            return;
        console.log('nmu');
        let fileContents = this.fs.read(this.outputDirectories.app.injectables);
        const serviceClassName = `${this.tsClass.name}Service`, importContent = `import { ${serviceClassName} } from "@services";`, containerDeclaration = `container.bind<${serviceClassName}>("${serviceClassName}").to(${serviceClassName});`, importComment = "// SERVICE IMPORTS - **DO NOT REMOVE THIS COMMENT**", registerFunction = "export const registerInjectables = (container: Container) => {";
        if (actionType === ClassActionType_1.ClassActionType.ADD_EDIT) {
            if (fileContents.indexOf(importContent) === -1) {
                const insertionIndex = fileContents.indexOf(importComment) + importComment.length;
                fileContents = fileContents.slice(0, insertionIndex) + `\n${importContent}` + fileContents.slice(insertionIndex);
            }
            if (!fileContents.includes(containerDeclaration)) {
                const insertionIndex = fileContents.indexOf(registerFunction) + registerFunction.length;
                fileContents = fileContents.slice(0, insertionIndex) + `\n\t${containerDeclaration}` + fileContents.slice(insertionIndex);
            }
        }
        else {
            fileContents = fileContents.replace(importContent, "");
            fileContents = fileContents.replace(containerDeclaration, "");
        }
        this.fs.write(this.outputDirectories.app.injectables, fileContents);
    }
}
exports.ServiceService = ServiceService;
//# sourceMappingURL=service.service.js.map