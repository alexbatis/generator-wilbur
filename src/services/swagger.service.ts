/*-----------------------------------IMPORTS---------------------------------*/
import * as Generator from "yeoman-generator";
import { Class } from "../models/index";
import { GeneralUtils, FileUtils } from "../utils/index";
import { constants, IOutputDirectories } from "../constants";

/* Designates whether swagger docs are to be added/edited or removed */
enum SwaggerActionType {
    ADD_EDIT,
    REMOVE
}

/*-----------------------------------SERVICE DEFINITION----------------------*/
export class SwaggerService extends Generator {
    generalUtils: GeneralUtils;		                // General utilities for yeoman generators
    outputDirectories: IOutputDirectories;          // Directories which are to be written to
    tsClass: Class;                                 // Class to be generated/removed
    fileUtil = new FileUtils();                     // Provides common filesystem functionalities

    constructor(args: any, options: any, private appName: string) {
        super(args, options);
        this.generalUtils = new GeneralUtils(args, options);
        this.outputDirectories = constants.generateOutputDirectories(this.destinationPath(this.appName));
    }

    /* Given a class, generate all necessary files for swagger documentation */
    addSwaggerDocs(tsClass: Class) {
        this.tsClass = tsClass;                     // Scope empty class to generate swagger docs
        this.addSwaggerDefinition();                // Add swagger definition files
        this.addSwaggerTag();                       // Add swagger tag files
        this.addSwaggerPaths();                     // Add swagger paths files
    }

    /* Given a class, remove all necessary files for swagger documentation */
    async removeSwaggerDocs(tsClass: Class) {
        this.tsClass = tsClass;                                             // Scope empty class to generate swagger docs
        await this.removeSwaggerFiles();                                    // Remove all swagger documentation files for class
        this.updateSwaggerDefinitionIndexFile(SwaggerActionType.REMOVE);    // Remove references from swagger definition files
        this.updateSwaggerPathsIndexFile(SwaggerActionType.REMOVE);         // Remove references from swagger paths file
        this.updateSwaggerTagIndexFile(SwaggerActionType.REMOVE);           // Remove references from swagger tags file
    }

    /* Delete swagger doc files for a class from the filesystem */
    private async removeSwaggerFiles() {
        const swaggerFiles = [                                                                              // Define swagger files to be removed
            this.outputDirectories.swagger.definitions + '/' + this.tsClass.name + '.definition.yaml',
            this.outputDirectories.swagger.tags + '/' + this.tsClass.name + '.tag.yaml',
            this.outputDirectories.swagger.paths + '/' + this.tsClass.name + '.paths.yaml',
            this.outputDirectories.swagger.paths + '/' + this.tsClass.name + '.id.paths.yaml',
        ];

        for (let i = 0; i < swaggerFiles.length; i++)
            await this.fileUtil.removeDirectory(swaggerFiles[i]);                                           // Delete swagger files from the filesystem
    }

    /* Create swagger definition file */
    private addSwaggerDefinition() {
        this.fs.copyTpl(
            this.generalUtils.directories.templates.swagger.definitions,
            this.outputDirectories.swagger.definitions + '/' + this.tsClass.name + '.definition.yaml',
            { tsClass: this.tsClass }
        );
        this.updateSwaggerDefinitionIndexFile(SwaggerActionType.ADD_EDIT);  // Add swagger definition references      
    }

    /* Update swagger definition file references on class add/remove */
    private updateSwaggerDefinitionIndexFile(action: SwaggerActionType) {
        let fileContents = this.fs.read(this.outputDirectories.swagger.definitionsIndex);                   // Read existing file contents
        const importContent = `\n${this.tsClass.name}:\n  $ref: ./${this.tsClass.name}.definition.yaml`;    // Content to be added/removed

        if (action === SwaggerActionType.ADD_EDIT) {
            if (fileContents.indexOf(importContent) === -1)                                                 // Search if content already exists in file
                fileContents += `${importContent}`;                                                         // Add content to file
        } else
            fileContents = fileContents.replace(importContent, "");                                         // Remove content from file

        this.fs.write(this.outputDirectories.swagger.definitionsIndex, fileContents);                       // Update file contents
    }

    /* Create swagger tag file */
    private addSwaggerTag() {
        this.fs.copyTpl(                                                                                    // Copy generated swagger tag file to filesystem
            this.generalUtils.directories.templates.swagger.tags,
            this.outputDirectories.swagger.tags + '/' + this.tsClass.name + '.tag.yaml',
            { tsClass: this.tsClass }
        );
        this.updateSwaggerTagIndexFile(SwaggerActionType.ADD_EDIT);                                         // Update swagger tag references
    }

    /* Update swagger tag file references on class add/remove */
    private updateSwaggerTagIndexFile(action: SwaggerActionType) {
        let fileContents = this.fs.read(this.outputDirectories.swagger.tagsIndex);                          // Read existing file contents
        const importContent = `\n${this.tsClass.name}:\n  $ref: ./${this.tsClass.name}.tag.yaml`;           // Content to be added/removed

        if (action === SwaggerActionType.ADD_EDIT) {
            if (fileContents.indexOf(importContent) === -1)                                                 // Search if content already exists in file
                fileContents += `${importContent}`;                                                         // Add content to file
        } else
            fileContents = fileContents.replace(importContent, "");                                         // Remove content from file

        this.fs.write(this.outputDirectories.swagger.tagsIndex, fileContents);                              // Update file contents
    }

    /* Create swagger paths files */
    private addSwaggerPaths() {
        this.fs.copyTpl(                                                                                    // Copy generated swagger path file to filesystem                          
            this.generalUtils.directories.templates.swagger.paths,
            this.outputDirectories.swagger.paths + '/' + this.tsClass.name + '.paths.yaml',
            { tsClass: this.tsClass }
        );

        this.fs.copyTpl(                                                                                    // Copy generated swagger paths:id file to filesystem
            this.generalUtils.directories.templates.swagger.idPaths,
            this.outputDirectories.swagger.paths + '/' + this.tsClass.name + '.id.paths.yaml',
            { tsClass: this.tsClass }
        );

        this.updateSwaggerPathsIndexFile(SwaggerActionType.ADD_EDIT);                                       // Update swagger tag references
    }

    /* Update swagger tag file references on class add/remove */
    private updateSwaggerPathsIndexFile(action: SwaggerActionType) {
        let fileContents = this.fs.read(this.outputDirectories.swagger.pathsIndex);                         // Read existing file contents
        const classNameLowerCase = this.tsClass.name.toLowerCase();                                         // Name of class to add/remove
        const importContent = `\n/${classNameLowerCase}s:\n  $ref: ./${this.tsClass.name}.paths.yaml\n/${classNameLowerCase}s/{id}:\n  $ref: ./${this.tsClass.name}.id.paths.yaml`;

        if (action === SwaggerActionType.ADD_EDIT) {
            if (fileContents.indexOf(importContent) === -1)                                                 // Search if content already exists in file
                fileContents += `${importContent}`;                                                         // Add content to file
        } else
            fileContents = fileContents.replace(importContent, "");                                         // Remove content from file

        this.fs.write(this.outputDirectories.swagger.pathsIndex, fileContents);                             // Update file contents
    }

}