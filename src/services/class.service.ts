/*-----------------------------------IMPORTS---------------------------------*/
import * as Generator from "yeoman-generator";
import { Class } from "../models/index";
import { GeneralUtils, FileUtils } from "../utils/index";
import { constants, IOutputDirectories } from "../constants";
import { SwaggerService } from "./swagger.service";
import { ClassActionType } from "../models/ClassActionType";
import { ControllerService } from "./controller.service";
import { ServiceService } from "./service.service";

/*-----------------------------------SERVICE DEFINITION----------------------*/
export class ClassService extends Generator {
    generalUtils: GeneralUtils;		                // General utilities for yeoman generators
    outputDirectories: IOutputDirectories;          // Directories which are to be written to
    tsClass: Class;                                 // Class to be generated/removed
    swaggerService: SwaggerService;                 // Service which generates/removes swagger docs
    controllerService: ControllerService;           // Service which generates/removes controllers, validators, routers
    serviceService: ServiceService;                 // Service which generates/removes services
    fileUtil = new FileUtils();                     // Provides common filesystem functionalities

    constructor(args: any, options: any, private appName?: string) {
        super(args, options);
        if (!appName)
            this.appName = '';
        this.generalUtils = new GeneralUtils(args, options);
        this.outputDirectories = constants.generateOutputDirectories(this.destinationPath(this.appName));
        this.swaggerService = new SwaggerService(args, options, this.appName);
        this.controllerService = new ControllerService(args, options, this.appName);
        this.serviceService = new ServiceService(args, options, this.appName);
    }

    /* Given a class, generate all necessary files to existing application */
    async generateClass(tsClass) {
        this.tsClass = tsClass;                                     // Scope class to generate
        this.generateClassFromTemplate();                           // Create model file
        this.updateClassIndexFile(ClassActionType.ADD_EDIT);        // Update class file with new export 
        this.swaggerService.addSwaggerDocs(tsClass);                // Generate all swagger docs
        this.controllerService.generateController(tsClass);         // Generate controller, validator, router
        this.serviceService.generateService(tsClass);               // Generate service
        return true;                                                // If reached, all generators fired
    }

    /* Given a class, remove all existing files pertaining to this class in existing application */
    async removeClass(tsClassName) {
        this.tsClass = new Class();                                 // Scope empty class to generate
        this.tsClass.name = tsClassName;                            // Add name of class to remove to empty class
        await this.removeClassFiles();                              // Delete model file
        await this.controllerService.removeController(this.tsClass);// Remove controller, validator, router
        await this.serviceService.removeService(this.tsClass);      // Remove service
        await this.swaggerService.removeSwaggerDocs(this.tsClass);  // Remove all swagger docs
        this.updateClassIndexFile(ClassActionType.REMOVE);          // Remove exports
    }

    /* Create class files */
    private generateClassFromTemplate() {
        this.fs.copyTpl(
            this.generalUtils.directories.templates.classBase + "/class.ts",
            this.outputDirectories.models.mongo + "/" + this.tsClass.name + ".ts",
            { model: this.tsClass }
        );
    }

    /* Delete class model files from existing project */
    private async removeClassFiles() {
        const modelDirectory = this.outputDirectories.models.mongo + "/" + this.tsClass.name + ".ts";
        this.fileUtil.removeDirectory(modelDirectory);
    }

    /* Add or remove exports for class index file */
    private updateClassIndexFile(actionType: ClassActionType) {
        let fileContents = this.fs.read(this.outputDirectories.models.mongoIndexFile);                  // Read existing file contents
        const className = this.tsClass.name.charAt(0).toUpperCase() + this.tsClass.name.substring(1);   // Name of class to add/remove
        const importContent = `export * from "./${className}";`;                                        // Content to be added/removed

        if (actionType === ClassActionType.ADD_EDIT) {
            if (fileContents.indexOf(importContent) === -1)                                             // Search if content already exists in file
                fileContents += `\n${importContent}`;                                                   // Add content to file
        } else
            fileContents = fileContents.replace(importContent, "");                                     // Remove content from file

        this.fs.write(this.outputDirectories.models.mongoIndexFile, fileContents);                      // Update file contents
    }

}
