/* WILBUR REMOVE CLASS GENERATOR
----------------------------------------------------------------------
- Can be used without web/desktop app (no configuration files needed)
- Run using:
	$ yo wilbur:remove-class
- Given an app configuration file, this generator will generate
  an entire application with the applications defined classes
- Use flags to designate install
	-> $ yo wilbur:remove-class
	-> $ yo wilbur:remove-class
*/

import * as Generator from "yeoman-generator";
import { constants } from "../constants/index"
import { GeneralUtils, FileUtils } from "../utils/index";
import { AppService, ClassService, commonService } from '../services/index';
import { Class } from "../models";


class WilburRemoveClassGenerator extends Generator {
	answers: any;					// Answers captured by prompt
	generalUtils: GeneralUtils;		// General utilities for yeoman generators
	classService: ClassService;		// Service for typescript class generation
	appService: AppService;			// Service for typescript class generation
	args: any;						// Arguments to pass to services (TODO: figure out how to inject these as dependencies at runtime)
	options: any;					// Options to pass to services (TODO: figure out how to inject these as dependencies at runtime)
	fileUtils = new FileUtils();	// Provides common filesystem functionalities
	definedClassNames: any;			// List of installed class names to be prompted to user

	constructor(args: any, options: any) {
		super(args, options);
		this.args = args;
		this.options = options;
		this.log(constants.wordArt.wilburLogo);
		this.generalUtils = new GeneralUtils(args, options);
		this.log(constants.wordArt.wilburRemoveClass);
	}

	public async prompting() {
		this.generalUtils.checkForProject();																	// Verifies the generator is run in the same directory as the generated app
		this.definedClassNames = this.generalUtils.getDefinedClassNames();										// Gets defined class names to prompt to user
		this.answers = await this.prompt(constants.prompts.createRemoveClassPrompt(this.definedClassNames)); 	// Get which class should be removed from the app
	}

	// Saving configurations and configure the project
	public configuring(): void {
		this.classService = new ClassService(this.args, this.options);
	}

	//  Where you write the generator specific files (routes, controllers, etc)
	public async writing() {
		this.classService.removeClass(this.answers.classNameToRemove);											// Remove selected class from app
	}

	// Called last, cleanup, say good bye, etc
	public end(): void {
		this.log('happy generating (-:');
	}
}

export default WilburRemoveClassGenerator;
