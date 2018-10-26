/*--------------------THIRD PARTY-------------------*/
// import { ObjectId } from "bson";
import * as request from "request-promise";
import { JsonConvert, ValueCheckingMode } from "json2typescript";
import { logger } from "@common";
/*--------------------CUSTOM-------------------*/
/*--------------------FUNCTIONS------------------------------------*/
// create the options for a request


/*--------------------CLASS-------------------*/
export class CommonService {

    createHttpOptions(requestType: string, path: string, auth: string): any {
        return {
            method: requestType,
            uri: path,
            headers: {
                Authorization: "Basic " + auth
            }
        };
    }
    // deserialize a json object into an object of type T
    deserialize<T>(jsonObj: Object, type: any) {
        const jsonConvert: JsonConvert = new JsonConvert();
        jsonConvert.ignorePrimitiveChecks = false; // don"t allow assigning number to string etc.
        jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL; // allow null
        let deserializedObj: T;
        try {
            deserializedObj = jsonConvert.deserialize(jsonObj, type);
            return deserializedObj;
        } catch (e) {
            logger.error(<Error>e);
            throw (e);
        }
    }
    // deserialize a json array object into an array of type T
    deserializeArray<T>(jsonArray: Object[], type: any) {
        const jsonConvert: JsonConvert = new JsonConvert();
        jsonConvert.ignorePrimitiveChecks = false; // don"t allow assigning number to string etc.
        jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL; // allow null
        let deserializedArray: Array<T>;
        try {
            deserializedArray = jsonConvert.deserializeArray(jsonArray, type);
            return deserializedArray;
        } catch (e) {
            logger.error(<Error>e);
            throw (e);
        }
    }
}

export default new CommonService();
