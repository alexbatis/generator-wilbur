/*-----------------------------------IMPORTS---------------------------------*/
import * as Generator from "yeoman-generator";
import { Class } from "../models/index";
import { GeneralUtils, FileUtils } from "../utils/index";
import { constants, IOutputDirectories } from "../constants";
import { ClassActionType } from "../models/ClassActionType";

/*-----------------------------------SERVICE DEFINITION----------------------*/
export class ControllerService extends Generator {
    generalUtils: GeneralUtils;		                // General utilities for yeoman generators
    outputDirectories: IOutputDirectories;          // Directories which are to be written to
    tsClass: Class;                                 // Class to be generated/removed
    fileUtil = new FileUtils();                     // Provides common filesystem functionalities
    private classNameCamelCase: string;             // Camel case name of class to be generated/removed
    useDI = true;                                   // Use dependency injection

    constructor(args: any, options: any, private appName: string) {
        super(args, options);
        this.generalUtils = new GeneralUtils(args, options);
        this.outputDirectories = constants.generateOutputDirectories(this.destinationPath(this.appName));
        this.useDI = (typeof options.useDI === 'boolean') ? options.useDI : true;
    }

    /* Given a class, generate all necessary controller  files to existing application */
    generateController(tsClass: Class) {
        this.tsClass = tsClass;                                                                                 // Read existing file contents
        this.classNameCamelCase = this.tsClass.name.charAt(0).toLowerCase() + this.tsClass.name.substring(1);   // Name of class to add/remove
        this.generateControllerFile();                                                                          // Generate controller file
        this.generateValidatorFile();                                                                           // Generate validator file
        this.updateControllerIndexFile(ClassActionType.ADD_EDIT);                                               // Modify index file

        if (!this.useDI) {
            this.updateRoutesFile(ClassActionType.ADD_EDIT);                                                    // Modify routes file
            this.generateRouterFile();                                                                          // Generate router file
        }

    }

    /* Given a class, remove controller, validator, and router */
    async removeController(tsClass: Class) {
        this.tsClass = tsClass;                                                                                 // Read existing file contents
        this.classNameCamelCase = this.tsClass.name.charAt(0).toLowerCase() + this.tsClass.name.substring(1);   // Name of class to add/remove
        await this.removeControllerFiles();                                                                     // Delete controller file
        this.updateControllerIndexFile(ClassActionType.REMOVE);                                                 // Remove controller exports
        this.updateRoutesFile(ClassActionType.REMOVE);                                                          // Remove router wiring
    }

    /* Delete controller, validator, and router from filesystem */
    private async removeControllerFiles() {
        const controllerDirectory = this.outputDirectories.controller.base + "/" + this.classNameCamelCase;     // Folder containing controller, validator, and router
        this.fileUtil.removeDirectory(controllerDirectory);                                                     // Remove contents of directory
    }

    /* Generate a controller file from a template */
    private generateControllerFile() {
        const templatePath = this.generalUtils.directories.templates.controller;

        this.fs.copyTpl(
            (this.useDI) ? templatePath.inversify : templatePath.controller,
            this.outputDirectories.controller.base + "/" + this.classNameCamelCase + '/' + this.classNameCamelCase + ".controller.ts",
            { tsClass: this.tsClass }
        );
    }

    /* Generate a router file from a template */
    private generateRouterFile() {
        this.fs.copyTpl(
            this.generalUtils.directories.templates.controller.router,
            this.outputDirectories.controller.base + "/" + this.classNameCamelCase + '/' + this.classNameCamelCase + ".router.ts",
            { tsClass: this.tsClass }
        );
    }

    /* Generate a validator file from a template */
    private generateValidatorFile() {
        this.fs.copyTpl(
            this.generalUtils.directories.templates.controller.validator,
            this.outputDirectories.controller.base + "/" + this.classNameCamelCase + '/' + this.classNameCamelCase + ".validator.ts",
            { tsClass: this.tsClass }
        );
    }

    /* Add or remove exports for controller index file */
    private updateControllerIndexFile(actionType: ClassActionType) {
        let fileContents = this.fs.read(this.outputDirectories.controller.index);                               // Read existing file contents
        let importContent = `// ${this.tsClass.name.toUpperCase()}\nexport * from "./${this.classNameCamelCase}/${this.classNameCamelCase}.validator";\nexport * from "./${this.classNameCamelCase}/${this.classNameCamelCase}.controller";`;
        if (!this.useDI) importContent = `${importContent}\nexport * from "./${this.classNameCamelCase}/${this.classNameCamelCase}.router";`;

        if (actionType === ClassActionType.ADD_EDIT) {
            if (fileContents.indexOf(importContent) === -1)                                                     // Search if content already exists in file
                fileContents += `\n${importContent}`;                                                           // Add content to file
        }
        else fileContents = fileContents.replace(importContent, "");                                            // Add content to file


        this.fs.write(this.outputDirectories.controller.index, fileContents);                                   // Add content to file
    }

    /* Update router wiring based on class add/remove */
    private updateRoutesFile(actionType: ClassActionType) {
        let fileContents = this.fs.read(this.outputDirectories.controller.routes);                              // Read existing file contents
        const classRouter = `${this.tsClass.name}Router`;                                                       // Name of router to import
        const classRouterLine = `,\n  ${classRouter}`;                                                          // Router import content
        const routerLine = `\n  app.use("/api/v1/${this.classNameCamelCase.toLocaleLowerCase()}s", ${classRouter});`;   // Routing wiring content

        if (actionType == ClassActionType.ADD_EDIT) {
            if (fileContents.indexOf(classRouter) === -1) {                                                                         // Search if content already exists in file
                const indexToAddImport = fileContents.indexOf(`} from "@controllers";`) - 1;
                fileContents = fileContents.slice(0, indexToAddImport) + classRouterLine + fileContents.slice(indexToAddImport);    // Update contents with router import

                const indexToAddRoute = fileContents.lastIndexOf(`};`) - 1;
                fileContents = fileContents.slice(0, indexToAddRoute) + routerLine + fileContents.slice(indexToAddRoute);           // Update contents with router wiring
            }
        }
        else {
            fileContents = fileContents.replace(classRouterLine, "");                                           // Remove router import
            fileContents = fileContents.replace(routerLine, "");                                                // Remove router wiring
        }

        this.fs.write(this.outputDirectories.controller.routes, fileContents);                                  // Update file contents
    }

}