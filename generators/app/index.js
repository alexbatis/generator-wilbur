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
class WilburAppGenerator extends Generator {
    constructor(args, options) {
        super(args, options);
        this.fileUtils = new index_2.FileUtils();
        this.args = args;
        this.options = options;
        this.log(index_1.constants.wordArt.wilburLogo);
        this.generalUtils = new index_2.GeneralUtils(args, options);
        this.log(index_1.constants.wordArt.wilburAppGenerator);
    }
    prompting() {
        return __awaiter(this, void 0, void 0, function* () {
            this.answers = yield this.prompt(index_1.constants.prompts.appPrompt);
        });
    }
    configuring() {
        if (!this.fileUtils.verifyFileExists(this.answers.appConfigurationFilePath))
            this.generalUtils.exitWithCriticalError(new Error(`
			Cannot run generator.
			Couldn't find app configuration file at ${this.answers.appConfigurationFilePath}`));
        else {
            try {
                const appConfig = this.fs.readJSON(this.answers.appConfigurationFilePath);
                this.appToGenerate = index_3.commonService.deserialize(appConfig, models_1.App);
                this.classService = new index_3.ClassService(this.args, this.options, `${this.appToGenerate.appName}`);
                this.appService = new index_3.AppService(this.args, this.options, `${this.appToGenerate.appName}`);
            }
            catch (err) {
                this.generalUtils.exitWithCriticalError(err);
            }
        }
    }
    writing() {
        return __awaiter(this, void 0, void 0, function* () {
            this.appService.generateApp(this.appToGenerate);
            for (let i = 0; i < this.appToGenerate.classes.length; i++)
                yield this.classService.generateClass(this.appToGenerate.classes[i]);
        });
    }
    install() {
        process.chdir(process.cwd() + `/${this.appToGenerate.appName}`);
        if (this.options.install)
            this.npmInstall();
        else if (this.options.yarnInstall)
            this.yarnInstall();
    }
    end() {
        this.log('happy generating (-:');
    }
}
exports.default = WilburAppGenerator;
//# sourceMappingURL=index.js.map