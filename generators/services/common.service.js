"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decorators = require("class-validator/decorator/decorators");
const json2typescript_1 = require("json2typescript");
const index_1 = require("../models/index");
const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
const ARGUMENT_NAMES = /([^\s,]+)/g;
class CommonService {
    constructor() {
        this.jsonConvert = new json2typescript_1.JsonConvert();
        this.jsonConvert.ignorePrimitiveChecks = false;
        this.jsonConvert.valueCheckingMode = json2typescript_1.ValueCheckingMode.ALLOW_NULL;
    }
    deserialize(jsonObj, type) {
        try {
            return this.jsonConvert.deserialize(jsonObj, type);
        }
        catch (e) {
            console.error(e);
            return e;
        }
    }
    deserializeArray(jsonArray, type) {
        try {
            return this.jsonConvert.deserializeArray(jsonArray, type);
        }
        catch (e) {
            console.error(e);
            throw e;
        }
    }
    getParamNames(func) {
        const fnStr = func.toString().replace(STRIP_COMMENTS, '');
        let result = fnStr
            .slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')'))
            .match(ARGUMENT_NAMES);
        if (result === null)
            result = [];
        return result;
    }
    getAvailableDecorators() {
        const decoratorsArray = [];
        Object.keys(decorators).forEach(key => {
            const parameters = this.getParamNames(decorators[key]);
            parameters.splice(parameters.indexOf('validationOptions'), 1);
            const newParams = [];
            parameters.forEach(param => {
                const type = (param === 'max' || param === 'min') ? 'number' : 'any';
                const newParam = new index_1.MemberVariableDecoratorParam({
                    name: param,
                    value: null,
                    type: type
                });
                newParams.push(newParam);
            });
            const decorator = new index_1.MemberVariableDecorator({
                name: key,
                params: newParams
            });
            decoratorsArray.push(decorator);
        });
        decoratorsArray.push(new index_1.MemberVariableDecorator({
            name: 'IsUnique',
            params: []
        }));
        return decoratorsArray;
    }
}
exports.commonService = new CommonService();
//# sourceMappingURL=common.service.js.map