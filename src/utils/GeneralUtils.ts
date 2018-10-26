import { constants } from '../constants/index';
import * as Generator from "yeoman-generator";
import { FileUtils } from './FileUtils';
const directoryExists = require("directory-exists");
const chalk = require("chalk");


// Structure for object laying out different directories
interface DirectoryScaffold {
    root: string,
    templates: {
        base: string,
        test: string
        appBase: string;
        classBase: string;
        swagger: {
            base: string;
            definitions: string;
            tags: string;
            paths: string;
            idPaths: string;
        },
        controller: {
            base: string,
            controller: string;
            router: string;
            validator: string;
        },
        service: {
            base: string;
            service: string;
        },
        other : {
            base: string;
            gitIgnore : string;
        }
    };
}

export class GeneralUtils extends Generator {
    directories: DirectoryScaffold = this.createDirectoryScaffold();        // Commonly referenced directories
    fileUtils = new FileUtils();

    constructor(args: any, options: any) {
        super(args, options)
        if (options.help)
            this.displayHelpMessageAndExit();
    }

    /* Creates an object containing commonly referenced directories */
    private createDirectoryScaffold(): DirectoryScaffold {
        const sourceRoot = `${__dirname.substring(0, __dirname.indexOf('generators'))}`;                    // Root directory of generator project
        return {
            root: sourceRoot,
            templates: {
                base: sourceRoot + constants.filePaths.templates.base,                                      // Base direcory for templates
                test: sourceRoot + constants.filePaths.templates.base + constants.filePaths.templates.test,  // Direcory for test templates
                appBase: sourceRoot + constants.filePaths.templates.base + constants.filePaths.templates.app,
                classBase: sourceRoot + constants.filePaths.templates.base + constants.filePaths.templates.classes.base,
                swagger: {
                    base: sourceRoot + constants.filePaths.templates.base + constants.filePaths.templates.swagger.base,
                    definitions: sourceRoot + constants.filePaths.templates.base + constants.filePaths.templates.swagger.definitions,
                    tags: sourceRoot + constants.filePaths.templates.base + constants.filePaths.templates.swagger.tags,
                    paths: sourceRoot + constants.filePaths.templates.base + constants.filePaths.templates.swagger.paths,
                    idPaths: sourceRoot + constants.filePaths.templates.base + constants.filePaths.templates.swagger.idPaths
                },
                controller: {
                    base: sourceRoot + constants.filePaths.templates.base + constants.filePaths.templates.controller.base,
                    controller: sourceRoot + constants.filePaths.templates.base + constants.filePaths.templates.controller.controller,
                    router: sourceRoot + constants.filePaths.templates.base + constants.filePaths.templates.controller.router,
                    validator: sourceRoot + constants.filePaths.templates.base + constants.filePaths.templates.controller.validator
                },
                service: {
                    base: sourceRoot + constants.filePaths.templates.base + constants.filePaths.templates.service.base,
                    service: sourceRoot + constants.filePaths.templates.base + constants.filePaths.templates.service.service
                },
                other : {
                    base : sourceRoot + constants.filePaths.templates.base + constants.filePaths.templates.other.base,
                    gitIgnore : sourceRoot + constants.filePaths.templates.base + constants.filePaths.templates.other.gitIgnore
                }
            }
        };
    }

    /* Checks that all template directories exist so 'not found' errors dont happen during execution when looking for templates */
    private async verifyTemplateDirectories(): Promise<Boolean> {
        Object.values(this.directories.templates).forEach(async (templateDirectory) => {
            const exists = await directoryExists(templateDirectory);
            if (!exists) throw new Error(`${templateDirectory} does not exist and this directory is needed to generate files for the application`);
        })
        return true;
    }

    public checkForProject() {
        if (!this.fileUtils.verifyFileExists('./package.json'))
            this.exitWithCriticalError(new Error(
                'Cannot find package.json in the current directory. Make sure the generator is run in the same directory as the project you want to add a class to.'
            ));
    }

    public getDefinedClassNames(): Array<String> {
        const outputDirectories = constants.generateOutputDirectories(this.destinationPath());
        const classesIndexPath = outputDirectories.models.mongoIndexFile;

        if (!this.fileUtils.verifyFileExists(classesIndexPath))
            this.exitWithCriticalError(new Error(
                `Cannot find file at ${classesIndexPath} to generate list of available classes. Make sure this file exists and is indicative of your apps configuration`
            ));

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

    public exitWithCriticalError(err: Error) {
        this.env.error(err);
    }

    private displayHelpMessageAndExit() {
        this.log(constants.wordArt.wilburHelp);
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

export default GeneralUtils;