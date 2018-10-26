import * as Generator from "yeoman-generator";
import { App, Class } from "../models/index";
import { GeneralUtils, FileUtils } from "../utils/index";
import { commonService } from "../services/index";

export class ConfigurationFileUtil extends Generator {
    generalUtils: GeneralUtils;		                // General utilities for yeoman generators
    fileUtil = new FileUtils();                     // Provides common filesystem functionalities

    constructor(args: any, options: any) {
        super(args, options)
        this.generalUtils = new GeneralUtils(args, options);
    }

    /* Read, parse, & return app configuration from file */
    readAppConfigurationFile(filePath: string): App {
        try {
            const fileContents = this.fs.readJSON(filePath)                                                     // Read file (will throw error if file doesn't exist)
            const appConfigurationObject = JSON.parse(fileContents);                                            // Read file contents
            try {
                const appConfiguration = commonService.deserialize<App>(appConfigurationObject, App);           // De-serialize app configuration
                return appConfiguration;
            } catch (error) {
                throw (new Error(`Could not parse the configuration file at ${filePath}. Error : ${error}`));   // Error reading or parsing file
            }
        } catch (err) {
            this.generalUtils.exitWithCriticalError(err);                                                       // Exit and kill yeoman generator
        }
    }

    /* Read, parse, & return class configuration from file */
    readClassConfigurationFile(filePath: string): Class {
        try {
            const fileContents = this.fs.readJSON(filePath)                                                     // Read file (will throw error if file doesn't exist)
            const classConfigurationObject = JSON.parse(fileContents);                                          // Read file contents
            try {
                const classConfiguration = commonService.deserialize<Class>(classConfigurationObject, Class);   // De-serialize class configuration
                return classConfiguration;
            } catch (error) {
                throw (new Error(`Could not parse the configuration file at ${filePath}. Error : ${error}`));   // Error reading or parsing file
            }
        } catch (err) {
            this.generalUtils.exitWithCriticalError(err);                                                       // Exit and kill yeoman generator
        }
    }
}