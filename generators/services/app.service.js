"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Generator = require("yeoman-generator");
const index_1 = require("../utils/index");
const constants_1 = require("../constants");
class AppService extends Generator {
    constructor(args, options, appName) {
        super(args, options);
        this.appName = appName;
        this.generalUtils = new index_1.GeneralUtils(args, options);
        this.outputDirectories = constants_1.constants.generateOutputDirectories(this.destinationPath(this.appName));
    }
    generateApp(app) {
        this.generateAppFromTemplate(app);
        this.generateGitIgnoreFile();
    }
    generateAppFromTemplate(app) {
        this.fs.copyTpl(this.generalUtils.directories.templates.appBase, this.outputDirectories.app.base, { configuration: app });
    }
    generateGitIgnoreFile() {
        this.fs.copyTpl(this.generalUtils.directories.templates.other.gitIgnore, this.outputDirectories.app.base + '/.gitignore', { configuration: null });
    }
}
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map