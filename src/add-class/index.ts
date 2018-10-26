/* WILBUR ADD CLASS GENERATOR
----------------------------------------------------------------------
- Intended to be used along web/desktop app to generate
  class configuration files
- Run using:
	$ yo wilbur:add-class
- Given an app configuration file, this generator will generate
  an entire application with the applications defined classes
- Use flags to designate install
	-> $ yo wilbur:add-class
	-> $ yo wilbur:add-class
*/

import * as Generator from "yeoman-generator";
import { constants } from "../constants/index"
import { GeneralUtils, FileUtils } from "../utils/index";
import { AppService, ClassService, commonService } from '../services/index';
import { Class } from "../models";


class WilburAddClassGenerator extends Generator {
	answers: any;					// Answers captured by prompt
	generalUtils: GeneralUtils;		// General utilities for yeoman generators
	classService: ClassService;		// Service for typescript class generation
	appService: AppService;			// Service for typescript class generation
	args: any;						// Arguments to pass to services (TODO: figure out how to inject these as dependencies at runtime)
	options: any;					// Options to pass to services (TODO: figure out how to inject these as dependencies at runtime)
	fileUtils = new FileUtils();	// Provides common filesystem functionalities
	classToGenerate: Class;			// De-serialized app to be generated 

	constructor(args: any, options: any) {
		super(args, options);
		this.args = args;
		this.options = options;
		this.log(constants.wordArt.wilburLogo);
		this.generalUtils = new GeneralUtils(args, options);
		this.log(constants.wordArt.wilburAddClass);
	}

	public async prompting() {
		this.generalUtils.checkForProject();																	// Verifies the generator is run in the same directory as the generated app
		this.answers = await this.prompt(constants.prompts.addClassPrompt);										// Prompt user for directory to class configuration file
	}

	// Saving configurations and configure the project
	public configuring(): void {
		if (!this.fileUtils.verifyFileExists(this.answers.classConfigurationFilePath))							// Verify application configuration file exists
			this.generalUtils.exitWithCriticalError(new Error(`
			Cannot run generator.
			Couldn't find app configuration file at ${this.answers.classConfigurationFilePath}`));				// Exit with error if configuration file doesn't exist
		else {
			try {
				const classConfig = this.fs.readJSON(this.answers.classConfigurationFilePath);					// Read file contents of class config file
				this.classToGenerate = commonService.deserialize<Class>(classConfig, Class);					// De-serialze the file's contents
				this.classService = new ClassService(this.args, this.options);									// Initialize class service with de-serialized class configuration 
			} catch (err) {
				this.generalUtils.exitWithCriticalError(err);													// Exit with error if unable to read or parse configuration
			}
		}
	}

	//  Where you write the generator specific files (routes, controllers, etc)
	public async writing() {
		this.classService.generateClass(this.classToGenerate); 													// Generate class from configuration file
	}

	// Called last, cleanup, say good bye, etc
	public end(): void {
		this.log('happy generating (-:');
	}
}

export default WilburAddClassGenerator;
