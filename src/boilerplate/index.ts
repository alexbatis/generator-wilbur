/* WILBUR BOILERPLATE APP GENERATOR
----------------------------------------------------------------------
- Can be used without web/desktop app (no configuration files needed)
- Run using:
	$ yo wilbur:boilerplate
- This generator will generate a full node/express/mongo app with
  a TodoItem sample class
- Use flags to designate install
	-> $ yo wilbur:boilerplate --install		  -> install using npm
	-> $ yo wilbur:boilerplate --yarn-install	  -> install using yarn
*/

import * as Generator from "yeoman-generator";
import { constants, boilerplateApp, todoItemClass } from "../constants/index"
import { GeneralUtils } from "../utils/index";
import { AppService, ClassService } from '../services/index';

class WilburBoilerplateAppGenerator extends Generator {
	answers: any;					// Answers captured by prompt
	generalUtils: GeneralUtils;		// General utilities for yeoman generators
	classService: ClassService;		// Service for typescript class generation
	appService: AppService;			// Service for typescript class generation
	args: any;						// Arguments to pass to services (TODO: figure out how to inject these as dependencies at runtime)
	options: any;					// Options to pass to services (TODO: figure out how to inject these as dependencies at runtime)

	constructor(args: any, options: any) {
		super(args, options);
		options.useDI = (options.useDI !== 'false')
		this.args = args;
		this.options = options;
		this.log(constants.wordArt.wilburLogo);
		this.generalUtils = new GeneralUtils(args, options);
		this.log(constants.wordArt.wilburBoilerplate);
	}

	// Saving configurations and configure the project
	public configuring(): void {
		this.classService = new ClassService(this.args, this.options, `${boilerplateApp.appName}`);
		this.appService = new AppService(this.args, this.options, `${boilerplateApp.appName}`);
	}

	//  Where you write the generator specific files (routes, controllers, etc)
	public writing(): void {
		// Write files from app template
		this.appService.generateApp(boilerplateApp);

		// Generate boilerplate model and associated file changes
		this.classService.generateClass(todoItemClass);
	}

	// Install dependencies based on flags at runtime
	public install(): void {
		process.chdir(process.cwd() + `/${boilerplateApp.appName}`);
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

export default WilburBoilerplateAppGenerator;
