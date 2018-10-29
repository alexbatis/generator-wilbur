"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Generator = require("yeoman-generator");
const index_1 = require("../constants/index");
const index_2 = require("../utils/index");
const index_3 = require("../services/index");
class WilburBoilerplateAppGenerator extends Generator {
    constructor(args, options) {
        super(args, options);
        this.args = args;
        this.options = options;
        this.log(index_1.constants.wordArt.wilburLogo);
        this.generalUtils = new index_2.GeneralUtils(args, options);
        this.log(index_1.constants.wordArt.wilburBoilerplate);
    }
    configuring() {
        this.classService = new index_3.ClassService(this.args, this.options, `${index_1.boilerplateApp.appName}`);
        this.appService = new index_3.AppService(this.args, this.options, `${index_1.boilerplateApp.appName}`);
    }
    writing() {
        this.appService.generateApp(index_1.boilerplateApp);
        this.classService.generateClass(index_1.todoItemClass);
    }
    install() {
        process.chdir(process.cwd() + `/${index_1.boilerplateApp.appName}`);
        if (this.options.install || this.options['install'])
            this.npmInstall();
        else if (this.options.yarnInstall || this.options['yarn-install'])
            this.yarnInstall();
    }
    end() {
        this.log('happy generating (-:');
    }
}
exports.default = WilburBoilerplateAppGenerator;
//# sourceMappingURL=index.js.map