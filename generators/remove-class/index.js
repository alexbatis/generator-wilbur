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
class WilburRemoveClassGenerator extends Generator {
    constructor(args, options) {
        super(args, options);
        this.fileUtils = new index_2.FileUtils();
        this.args = args;
        this.options = options;
        this.log(index_1.constants.wordArt.wilburLogo);
        this.generalUtils = new index_2.GeneralUtils(args, options);
        this.log(index_1.constants.wordArt.wilburRemoveClass);
    }
    prompting() {
        return __awaiter(this, void 0, void 0, function* () {
            this.generalUtils.checkForProject();
            this.definedClassNames = this.generalUtils.getDefinedClassNames();
            this.answers = yield this.prompt(index_1.constants.prompts.createRemoveClassPrompt(this.definedClassNames));
        });
    }
    configuring() {
        this.classService = new index_3.ClassService(this.args, this.options);
    }
    writing() {
        return __awaiter(this, void 0, void 0, function* () {
            this.classService.removeClass(this.answers.classNameToRemove);
        });
    }
    end() {
        this.log('happy generating (-:');
    }
}
exports.default = WilburRemoveClassGenerator;
//# sourceMappingURL=index.js.map