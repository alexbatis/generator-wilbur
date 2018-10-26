"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Generator = require("yeoman-generator");
const index_1 = require("../models/index");
const index_2 = require("../utils/index");
const index_3 = require("../services/index");
class ConfigurationFileUtil extends Generator {
    constructor(args, options) {
        super(args, options);
        this.fileUtil = new index_2.FileUtils();
        this.generalUtils = new index_2.GeneralUtils(args, options);
    }
    readAppConfigurationFile(filePath) {
        try {
            const fileContents = this.fs.readJSON(filePath);
            const appConfigurationObject = JSON.parse(fileContents);
            try {
                const appConfiguration = index_3.commonService.deserialize(appConfigurationObject, index_1.App);
                return appConfiguration;
            }
            catch (error) {
                throw (new Error(`Could not parse the configuration file at ${filePath}. Error : ${error}`));
            }
        }
        catch (err) {
            this.generalUtils.exitWithCriticalError(err);
        }
    }
    readClassConfigurationFile(filePath) {
        try {
            const fileContents = this.fs.readJSON(filePath);
            const classConfigurationObject = JSON.parse(fileContents);
            try {
                const classConfiguration = index_3.commonService.deserialize(classConfigurationObject, index_1.Class);
                return classConfiguration;
            }
            catch (error) {
                throw (new Error(`Could not parse the configuration file at ${filePath}. Error : ${error}`));
            }
        }
        catch (err) {
            this.generalUtils.exitWithCriticalError(err);
        }
    }
}
exports.ConfigurationFileUtil = ConfigurationFileUtil;
//# sourceMappingURL=ConfigurationFileUtils.js.map