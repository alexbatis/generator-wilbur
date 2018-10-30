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
var SwaggerActionType;
(function (SwaggerActionType) {
    SwaggerActionType[SwaggerActionType["ADD_EDIT"] = 0] = "ADD_EDIT";
    SwaggerActionType[SwaggerActionType["REMOVE"] = 1] = "REMOVE";
})(SwaggerActionType || (SwaggerActionType = {}));
class SwaggerService extends Generator {
    constructor(args, options, appName) {
        super(args, options);
        this.appName = appName;
        this.fileUtil = new index_1.FileUtils();
        this.generalUtils = new index_1.GeneralUtils(args, options);
        this.outputDirectories = constants_1.constants.generateOutputDirectories(this.destinationPath(this.appName));
    }
    addSwaggerDocs(tsClass) {
        this.tsClass = tsClass;
        this.addSwaggerDefinition();
        this.addSwaggerTag();
        this.addSwaggerPaths();
    }
    removeSwaggerDocs(tsClass) {
        return __awaiter(this, void 0, void 0, function* () {
            this.tsClass = tsClass;
            yield this.removeSwaggerFiles();
            this.updateSwaggerDefinitionIndexFile(SwaggerActionType.REMOVE);
            this.updateSwaggerPathsIndexFile(SwaggerActionType.REMOVE);
            this.updateSwaggerTagIndexFile(SwaggerActionType.REMOVE);
        });
    }
    removeSwaggerFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const swaggerFiles = [
                this.outputDirectories.swagger.definitions + '/' + this.tsClass.name + '.definition.yaml',
                this.outputDirectories.swagger.tags + '/' + this.tsClass.name + '.tag.yaml',
                this.outputDirectories.swagger.paths + '/' + this.tsClass.name + '.paths.yaml',
                this.outputDirectories.swagger.paths + '/' + this.tsClass.name + '.id.paths.yaml',
            ];
            for (let i = 0; i < swaggerFiles.length; i++)
                yield this.fileUtil.removeDirectory(swaggerFiles[i]);
        });
    }
    addSwaggerDefinition() {
        this.fs.copyTpl(this.generalUtils.directories.templates.swagger.definitions, this.outputDirectories.swagger.definitions + '/' + this.tsClass.name + '.definition.yaml', { tsClass: this.tsClass });
        this.updateSwaggerDefinitionIndexFile(SwaggerActionType.ADD_EDIT);
    }
    updateSwaggerDefinitionIndexFile(action) {
        let fileContents = this.fs.read(this.outputDirectories.swagger.definitionsIndex);
        const importContent = `\n${this.tsClass.name}:\n  $ref: ./${this.tsClass.name}.definition.yaml`;
        if (action === SwaggerActionType.ADD_EDIT) {
            if (fileContents.indexOf(importContent) === -1)
                fileContents += `${importContent}`;
        }
        else
            fileContents = fileContents.replace(importContent, "");
        this.fs.write(this.outputDirectories.swagger.definitionsIndex, fileContents);
    }
    addSwaggerTag() {
        this.fs.copyTpl(this.generalUtils.directories.templates.swagger.tags, this.outputDirectories.swagger.tags + '/' + this.tsClass.name + '.tag.yaml', { tsClass: this.tsClass });
        this.updateSwaggerTagIndexFile(SwaggerActionType.ADD_EDIT);
    }
    updateSwaggerTagIndexFile(action) {
        let fileContents = this.fs.read(this.outputDirectories.swagger.tagsIndex);
        const importContent = `\n${this.tsClass.name}:\n  $ref: ./${this.tsClass.name}.tag.yaml`;
        if (action === SwaggerActionType.ADD_EDIT) {
            if (fileContents.indexOf(importContent) === -1)
                fileContents += `${importContent}`;
        }
        else
            fileContents = fileContents.replace(importContent, "");
        this.fs.write(this.outputDirectories.swagger.tagsIndex, fileContents);
    }
    addSwaggerPaths() {
        this.fs.copyTpl(this.generalUtils.directories.templates.swagger.paths, this.outputDirectories.swagger.paths + '/' + this.tsClass.name + '.paths.yaml', { tsClass: this.tsClass });
        this.fs.copyTpl(this.generalUtils.directories.templates.swagger.idPaths, this.outputDirectories.swagger.paths + '/' + this.tsClass.name + '.id.paths.yaml', { tsClass: this.tsClass });
        this.updateSwaggerPathsIndexFile(SwaggerActionType.ADD_EDIT);
    }
    updateSwaggerPathsIndexFile(action) {
        let fileContents = this.fs.read(this.outputDirectories.swagger.pathsIndex);
        const classNameLowerCase = this.tsClass.name.toLowerCase();
        const importContent = `\n/${classNameLowerCase}s:\n  $ref: ./${this.tsClass.name}.paths.yaml\n/${classNameLowerCase}s/{id}:\n  $ref: ./${this.tsClass.name}.id.paths.yaml`;
        if (action === SwaggerActionType.ADD_EDIT) {
            if (fileContents.indexOf(importContent) === -1)
                fileContents += `${importContent}`;
        }
        else
            fileContents = fileContents.replace(importContent, "");
        this.fs.write(this.outputDirectories.swagger.pathsIndex, fileContents);
    }
}
exports.SwaggerService = SwaggerService;
//# sourceMappingURL=swagger.service.js.map