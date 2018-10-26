/*-----------------------------------IMPORTS---------------------------------*/
/*--------------------THIRD PARTY-------------------*/
import * as decorators from 'class-validator/decorator/decorators';
import { JsonConvert, ValueCheckingMode } from 'json2typescript';
/*--------------------CUSTOM------------------------*/
import { MemberVariableDecorator, MemberVariableDecoratorParam } from '../models/index';

// Regex's for stripping comments and getting argument names from function definition
const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
const ARGUMENT_NAMES = /([^\s,]+)/g;

/*-----------------------------------SERVICE DEFINITION----------------------*/
class CommonService {

  private jsonConvert = new JsonConvert();
  constructor() {
    this.jsonConvert.ignorePrimitiveChecks = false;                           // Don"t allow assigning number to string etc.
    this.jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL;        // Allow null
   }

  /* De-serialize a json object object into an object of type T */
  deserialize<T>(jsonObj: Object, type: any): T {
    try {
      return this.jsonConvert.deserialize(jsonObj, type);                     // Return deserialized object
    } catch (e) {
      console.error(<Error>e);                                                // Error in deserialization
      return e;
    }
  }

  /* De-serialize a json array object into an array of objects of type T */
  deserializeArray<T>(jsonArray: Object[], type: any): Array<T> {
    try {
      return this.jsonConvert.deserializeArray(jsonArray, type);              // Return deserialized array
    } catch (e) {
      console.error(<Error>e);                                                // Error in deserialization
      throw e;
    }
  }

  /* Get parameter names from function - used for getting parameter names for validation decorators */
  getParamNames(func) {
    const fnStr = func.toString().replace(STRIP_COMMENTS, '');                // Take comments out of string
    let result = fnStr
      .slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')'))                      // Filter out param names
      .match(ARGUMENT_NAMES);
    if (result === null) result = [];
    return result;
  }

  /* Get decorator names from class-validator library */
  getAvailableDecorators(): Array<MemberVariableDecorator> {
    const decoratorsArray = [];
    Object.keys(decorators).forEach(key => {                                  // Iterate over all decorators object
      const parameters = this.getParamNames(decorators[key]);                 // Get param names from validation function
      parameters.splice(parameters.indexOf('validationOptions'), 1);
      const newParams = [];

      parameters.forEach(param => {                                           // Iterate over each validation parameter
        const type = (param === 'max' || param === 'min') ? 'number' : 'any'; // Designate type based on param name TODO: define types for more params
        const newParam = new MemberVariableDecoratorParam({                   // Create Decorator param object
          name: param,
          value: null,
          type: type
        });
        newParams.push(newParam);
      });
      const decorator = new MemberVariableDecorator({                         // Create Decorator object
        name: key,
        params: newParams
      });

      decoratorsArray.push(decorator);                                        // Append decorator to all decorators
    });

    decoratorsArray.push(new MemberVariableDecorator({                        // Include unique typegoose decorator as it's not included in class-validator decorators
      name: 'IsUnique',
      params: []
    }));

    return decoratorsArray;
  }
}

export const commonService = new CommonService();
