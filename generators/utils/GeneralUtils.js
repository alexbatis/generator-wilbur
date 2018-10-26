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
const index_1 = require("../constants/index");
const Generator = require("yeoman-generator");
const FileUtils_1 = require("./FileUtils");
const directoryExists = require("directory-exists");
const chalk = require("chalk");
class GeneralUtils extends Generator {
    constructor(args, options) {
        super(args, options);
        this.directories = this.createDirectoryScaffold();
        this.fileUtils = new FileUtils_1.FileUtils();
        if (options.help)
            this.displayHelpMessageAndExit();
    }
    createDirectoryScaffold() {
        const sourceRoot = `${__dirname.substring(0, __dirname.indexOf('generators'))}`;
        return {
            root: sourceRoot,
            templates: {
                base: sourceRoot + index_1.constants.filePaths.templates.base,
                test: sourceRoot + index_1.constants.filePaths.templates.base + index_1.constants.filePaths.templates.test,
                appBase: sourceRoot + index_1.constants.filePaths.templates.base + index_1.constants.filePaths.templates.app,
                classBase: sourceRoot + index_1.constants.filePaths.templates.base + index_1.constants.filePaths.templates.classes.base,
                swagger: {
                    base: sourceRoot + index_1.constants.filePaths.templates.base + index_1.constants.filePaths.templates.swagger.base,
                    definitions: sourceRoot + index_1.constants.filePaths.templates.base + index_1.constants.filePaths.templates.swagger.definitions,
                    tags: sourceRoot + index_1.constants.filePaths.templates.base + index_1.constants.filePaths.templates.swagger.tags,
                    paths: sourceRoot + index_1.constants.filePaths.templates.base + index_1.constants.filePaths.templates.swagger.paths,
                    idPaths: sourceRoot + index_1.constants.filePaths.templates.base + index_1.constants.filePaths.templates.swagger.idPaths
                },
                controller: {
                    base: sourceRoot + index_1.constants.filePaths.templates.base + index_1.constants.filePaths.templates.controller.base,
                    controller: sourceRoot + index_1.constants.filePaths.templates.base + index_1.constants.filePaths.templates.controller.controller,
                    router: sourceRoot + index_1.constants.filePaths.templates.base + index_1.constants.filePaths.templates.controller.router,
                    validator: sourceRoot + index_1.constants.filePaths.templates.base + index_1.constants.filePaths.templates.controller.validator
                },
                service: {
                    base: sourceRoot + index_1.constants.filePaths.templates.base + index_1.constants.filePaths.templates.service.base,
                    service: sourceRoot + index_1.constants.filePaths.templates.base + index_1.constants.filePaths.templates.service.service
                },
                other: {
                    base: sourceRoot + index_1.constants.filePaths.templates.base + index_1.constants.filePaths.templates.other.base,
                    gitIgnore: sourceRoot + index_1.constants.filePaths.templates.base + index_1.constants.filePaths.templates.other.gitIgnore
                }
            }
        };
    }
    verifyTemplateDirectories() {
        return __awaiter(this, void 0, void 0, function* () {
            Object.values(this.directories.templates).forEach((templateDirectory) => __awaiter(this, void 0, void 0, function* () {
                const exists = yield directoryExists(templateDirectory);
                if (!exists)
                    throw new Error(`${templateDirectory} does not exist and this directory is needed to generate files for the application`);
            }));
            return true;
        });
    }
    checkForProject() {
        if (!this.fileUtils.verifyFileExists('./package.json'))
            this.exitWithCriticalError(new Error('Cannot find package.json in the current directory. Make sure the generator is run in the same directory as the project you want to add a class to.'));
    }
    getDefinedClassNames() {
        const outputDirectories = index_1.constants.generateOutputDirectories(this.destinationPath());
        const classesIndexPath = outputDirectories.models.mongoIndexFile;
        if (!this.fileUtils.verifyFileExists(classesIndexPath))
            this.exitWithCriticalError(new Error(`Cannot find file at ${classesIndexPath} to generate list of available classes. Make sure this file exists and is indicative of your apps configuration`));
        let indexFile = this.fs.read(classesIndexPath);
        const classes = [];
        const lengthOfImport = "export * from \"./".length;
        var lines = indexFile.split("\n");
        for (var i = 0; i < lines.length; i++) {
            let indexOfModelImport = lines[i].indexOf("export * from \"./");
            if (indexOfModelImport !== -1)
                classes.push({ name: lines[i].substring(indexOfModelImport + lengthOfImport, lines[i].indexOf("\";")) });
        }
        return classes;
    }
    exitWithCriticalError(err) {
        this.env.error(err);
    }
    displayHelpMessageAndExit() {
        this.log(index_1.constants.wordArt.wilburHelp);
        this.log(`
Let's get started using the wilbur generator. Well have you up and running in no time.
Here are the commands you can run.

${chalk.green(`yo wilbur`)}
    - this will start the ${chalk.yellow(`application generator`)}
    - be sure to have a app configuration file handy as it will be needed to do anything useful
    - if you dont have an app configuration file handy, you can generate one at the web portal <here>.
    - in order to avoid having to manually enter configuration files, its reccomended to use the desktop app. you can get it <here>.

${chalk.green(`yo wilbur:boilerplate`)}
    - this will start the ${chalk.yellow(`boilerplate application generator`)} 
    - you dont need to have a configuration file handy, but you wont be able to specify any custom settings for the app

${chalk.green(`yo wilbur:add-class`)}
    - this will start the ${chalk.yellow(`add class generator`)}
    - be sure to have a class configuration file handy as it will be needed to do anything useful
    - be sure to run in the same directory as the wilbur application you've already generated or the add class generator will immediately exit
    - in order to avoid having to manually enter configuration files, its reccomended to use the desktop app. you can get it <here>.

${chalk.green(`yo wilbur:remove-class`)}
  - this will start the ${chalk.yellow(`remove class generator`)}
  - be sure to run in the same directory as the wilbur application you've already generated or the remove class generator will immediately exit
  - you will be presented a list of classes you've already generated (as defined in src/models/db/mongodb/index.ts)

For any additional questions/support please visit the git repo at <gitRepoHere>
  `);
        this.log('happy generating (-:\n');
        process.exit(0);
    }
}
exports.GeneralUtils = GeneralUtils;
exports.default = GeneralUtils;
//# sourceMappingURL=GeneralUtils.js.map