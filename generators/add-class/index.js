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
const index_1 = require("../constants/index");
const index_2 = require("../utils/index");
const index_3 = require("../services/index");
const models_1 = require("../models");
class WilburAddClassGenerator extends Generator {
    constructor(args, options) {
        super(args, options);
        this.fileUtils = new index_2.FileUtils();
        this.args = args;
        this.options = options;
        this.log(index_1.constants.wordArt.wilburLogo);
        this.generalUtils = new index_2.GeneralUtils(args, options);
        this.log(index_1.constants.wordArt.wilburAddClass);
    }
    prompting() {
        return __awaiter(this, void 0, void 0, function* () {
            this.generalUtils.checkForProject();
            this.answers = yield this.prompt(index_1.constants.prompts.addClassPrompt);
        });
    }
    configuring() {
        if (!this.fileUtils.verifyFileExists(this.answers.classConfigurationFilePath))
            this.generalUtils.exitWithCriticalError(new Error(`
			Cannot run generator.
			Couldn't find app configuration file at ${this.answers.classConfigurationFilePath}`));
        else {
            try {
                const classConfig = this.fs.readJSON(this.answers.classConfigurationFilePath);
                this.classToGenerate = index_3.commonService.deserialize(classConfig, models_1.Class);
                const options = Object.assign({}, this.options, { useDI: this.answers.useDI });
                this.classService = new index_3.ClassService(this.args, options);
            }
            catch (err) {
                this.generalUtils.exitWithCriticalError(err);
            }
        }
    }
    writing() {
        return __awaiter(this, void 0, void 0, function* () {
            this.classService.generateClass(this.classToGenerate);
        });
    }
    end() {
        this.log('happy generating (-:');
    }
}
exports.default = WilburAddClassGenerator;
//# sourceMappingURL=index.js.map