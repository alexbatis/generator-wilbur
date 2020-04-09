"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Prompts {
    constructor() {
        this.appPrompt = [{
                type: "input",
                name: "appConfigurationFilePath",
                message: "Your configuration file\'s name",
                default: process.cwd() + '/app.json'
            }];
        this.addClassPrompt = [{
                type: "input",
                name: "classConfigurationFilePath",
                message: "Your configuration file\'s name",
                default: process.cwd() + '/class.json'
            }, {
                type: "confirm",
                name: "useDI",
                message: "Use dependency injection? (inversify-express-utils)",
                default: true
            }];
    }
    createRemoveClassPrompt(definedClassNames) {
        return [{
                type: "list",
                name: "classNameToRemove",
                message: "Select the name of the class you would like to remove",
                choices: definedClassNames
            }];
    }
}
exports.Prompts = Prompts;
//# sourceMappingURL=Prompts.js.map