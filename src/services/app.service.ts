/*-----------------------------------IMPORTS---------------------------------*/
import * as Generator from "yeoman-generator";
import { App } from "../models/index";
import { GeneralUtils } from "../utils/index";
import { constants, IOutputDirectories } from "../constants";

/*-----------------------------------SERVICE DEFINITION----------------------*/
export class AppService extends Generator {
    generalUtils: GeneralUtils;		// General utilities for yeoman generators
    outputDirectories: IOutputDirectories;

    constructor(args: any, options: any, private appName: string) {
        super(args, options);
        this.generalUtils = new GeneralUtils(args, options);
        this.outputDirectories = constants.generateOutputDirectories(this.destinationPath(this.appName));
    }

    /* Given an app, generate all necessary files to create application */
    generateApp(app: App) {
        this.generateAppFromTemplate(app);      // Create base app files from template
        this.generateGitIgnoreFile();           // Add .gitignore to project
    }

    /* Copy & generate all files from /templates/app to the desired output directory */
    private generateAppFromTemplate(app: App) {
        this.fs.copyTpl(
            this.generalUtils.directories.templates.appBase,
            this.outputDirectories.app.base,
            { configuration: app }
        );
    }

    /* add .gitignore file to project */
    private generateGitIgnoreFile() {
        this.fs.copyTpl(
            this.generalUtils.directories.templates.other.gitIgnore,
            this.outputDirectories.app.base + '/.gitignore',
            { configuration: null }
        );
    }


}
