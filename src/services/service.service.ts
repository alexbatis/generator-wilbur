/*-----------------------------------IMPORTS---------------------------------*/
import * as Generator from "yeoman-generator";
import { Class } from "../models/index";
import { GeneralUtils, FileUtils } from "../utils/index";
import { constants, IOutputDirectories } from "../constants";
import { ClassActionType } from "../models/ClassActionType";

/*-----------------------------------SERVICE DEFINITION----------------------*/
export class ServiceService extends Generator {
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

    /* Given a class, generate all necessary service files to existing application */
    generateService(tsClass: Class) {
        this.tsClass = tsClass;                                                                                 // Read existing file contents
        this.classNameCamelCase = this.tsClass.name.charAt(0).toLowerCase() + this.tsClass.name.substring(1);   // Name of class to add/remove
        this.generateServiceFile();                                                                             // Generate service file
        this.updateServiceIndexFile(ClassActionType.ADD_EDIT);                                                  // Modify services index file
        this.updateDIContainer(ClassActionType.ADD_EDIT);                                                       // Modify DI container
    }

    /* Given a class, remove service file and its references */
    async removeService(tsClass) {
        this.tsClass = tsClass;                                                                                 // Read existing file contents
        this.classNameCamelCase = this.tsClass.name.charAt(0).toLowerCase() + this.tsClass.name.substring(1);   // Name of class to add/remove
        await this.removeServiceFiles();                                                                        // Delete service file from filesystem
        this.updateServiceIndexFile(ClassActionType.REMOVE);                                                    // Remove reference to service files
        this.updateDIContainer(ClassActionType.REMOVE);                                                         // Modify DI container
    }

    /* Delete service file from filesystem */
    private async removeServiceFiles() {
        const serviceDirectory = this.outputDirectories.service.base + "/" + this.classNameCamelCase;           // Directory containing service file
        this.fileUtil.removeDirectory(serviceDirectory);                                                        // Delete service file directory from filesystem
    }

    /* Generate a service file from a template */
    private generateServiceFile() {
        const templatePath = this.generalUtils.directories.templates.service;

        this.fs.copyTpl(
            (this.useDI) ? templatePath.inversify : templatePath.service,
            this.outputDirectories.service.base + "/" + this.classNameCamelCase + '/' + this.classNameCamelCase + ".service.ts",
            { tsClass: this.tsClass }
        );
    }

    /* Add or remove exports for service index file */
    private updateServiceIndexFile(actionType: ClassActionType) {
        let fileContents = this.fs.read(this.outputDirectories.service.index);                                  // Read existing file contents               
        const importContent = `// ${this.tsClass.name.toUpperCase()}\nexport * from "./${this.classNameCamelCase}/${this.classNameCamelCase}.service";`;

        if (actionType === ClassActionType.ADD_EDIT) {
            if (fileContents.indexOf(importContent) === -1)                                                     // Search if content already exists in file
                fileContents += `\n${importContent}`;                                                           // Add content to file
        } else {
            fileContents = fileContents.replace(importContent, "");                                             // Remove import content from file
        }

        this.fs.write(this.outputDirectories.service.index, fileContents);                                      // Add content to file
    }

    private updateDIContainer(actionType: ClassActionType) {
        console.log('sup')
        if (!this.useDI) return
        console.log('nmu')
        let fileContents = this.fs.read(this.outputDirectories.app.injectables);                                // Read existing file contents               
        const serviceClassName = `${this.tsClass.name}Service`,
            importContent = `import { ${serviceClassName} } from "@services";`,
            containerDeclaration = `container.bind<${serviceClassName}>("${serviceClassName}").to(${serviceClassName});`,
            importComment = "// SERVICE IMPORTS - **DO NOT REMOVE THIS COMMENT**",
            registerFunction = "export const registerInjectables = (container: Container) => {";


        if (actionType === ClassActionType.ADD_EDIT) {
            if (fileContents.indexOf(importContent) === -1) {                                                   // Add service import
                const insertionIndex = fileContents.indexOf(importComment) + importComment.length;
                fileContents = fileContents.slice(0, insertionIndex) + `\n${importContent}` + fileContents.slice(insertionIndex)
            }

            if (!fileContents.includes(containerDeclaration)) {
                const insertionIndex = fileContents.indexOf(registerFunction) + registerFunction.length;
                fileContents = fileContents.slice(0, insertionIndex) + `\n\t${containerDeclaration}` + fileContents.slice(insertionIndex)
            }
        } else {
            fileContents = fileContents.replace(importContent, "");                                             // Remove import content from file
            fileContents = fileContents.replace(containerDeclaration, "");                                             // Remove container declaration from file
        }

        this.fs.write(this.outputDirectories.app.injectables, fileContents);                                      // Add content to file
    }

}
