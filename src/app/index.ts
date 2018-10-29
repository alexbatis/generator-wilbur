/* WILBUR APP GENERATOR
----------------------------------------------------------------------
- Intended to be used along web/desktop app to generate
  application configuration files
- Run using:
	$ yo wilbur
- Given an app configuration file, this generator will generate
  an entire application with the applications defined classes
- Use flags to designate install
	-> $ yo wilbur --install		  -> install using npm
	-> $ yo wilbur --yarn-install	  -> install using yarn
*/

import * as Generator from "yeoman-generator";
import { constants } from "../constants/index"
import { GeneralUtils, FileUtils } from "../utils/index";
import { AppService, ClassService, commonService } from '../services/index';
import { App } from "../models";

class WilburAppGenerator extends Generator {
	answers: any;					// Answers captured by prompt
	generalUtils: GeneralUtils;		// General utilities for yeoman generators
	classService: ClassService;		// Service for typescript class generation
	appService: AppService;			// Service for typescript app generation
	args: any;						// Arguments to pass to services (TODO: figure out how to inject these as dependencies at runtime)
	options: any;					// Options to pass to services (TODO: figure out how to inject these as dependencies at runtime)
	fileUtils = new FileUtils();	// Provides common filesystem functionalities
	appToGenerate: App;				// De-serialized app to be generated 

	constructor(args: any, options: any) {
		super(args, options);
		this.args = args;
		this.options = options;
		this.log(constants.wordArt.wilburLogo);
		this.generalUtils = new GeneralUtils(args, options);
		this.log(constants.wordArt.wilburAppGenerator);
	}

	public async prompting() {
		this.answers = await this.prompt(constants.prompts.appPrompt);
	}

	// Saving configurations and configure the project
	public configuring(): void {
		if (!this.fileUtils.verifyFileExists(this.answers.appConfigurationFilePath))							// Verify application configuration file exists
			this.generalUtils.exitWithCriticalError(new Error(`
			Cannot run generator.
			Couldn't find app configuration file at ${this.answers.appConfigurationFilePath}`));				// Exit with error if configuration file doesn't exist
		else {
			try {
				const appConfig = this.fs.readJSON(this.answers.appConfigurationFilePath);						// Read file contents of app config file
				this.appToGenerate = commonService.deserialize<App>(appConfig, App);							// De-serialze the file's contents
				this.classService = new ClassService(this.args, this.options, `${this.appToGenerate.appName}`);	// Initialize class service with de-serialized configuration 
				this.appService = new AppService(this.args, this.options, `${this.appToGenerate.appName}`);		// Initialize app service with de-serialized configuration
			} catch (err) {
				this.generalUtils.exitWithCriticalError(err);													// Exit with error if unable to read or parse configuration
			}
		}
	}

	//  Where you write the generator specific files (routes, controllers, etc)
	public async writing() {
		this.appService.generateApp(this.appToGenerate);											// Write files from app template

		for (let i = 0; i < this.appToGenerate.classes.length; i++)												// Generate each class in configuration
			await this.classService.generateClass(this.appToGenerate.classes[i]);
	}

	// Install dependencies based on flags at runtime
	public install(): void {
		process.chdir(process.cwd() + `/${this.appToGenerate.appName}`);
		if (this.options.install || this.options['install'])
			this.npmInstall();					// Install deps with npm
		else if (this.options.yarnInstall || this.options['yarn-install'])
			this.yarnInstall();					// Install deps with yarn
	}

	// Called last, cleanup, say good bye, etc
	public end(): void {
		this.log('happy generating (-:');
	}
}

export default WilburAppGenerator;
