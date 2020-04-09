/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import { JsonConvert, ValueCheckingMode } from "json2typescript";
/* --------------------------------- CUSTOM --------------------------------- */
import { logger } from "@common";


/* -------------------------------------------------------------------------- */
/*                             SERVICE DEFINITION                             */
/* -------------------------------------------------------------------------- */
export class CommonService {

    /* --------------------------------- METHODS -------------------------------- */
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
    deserialize<T>(jsonObj: Object, type: any): T {
        const jsonConvert: JsonConvert = new JsonConvert();
        jsonConvert.ignorePrimitiveChecks = false; // don"t allow assigning number to string etc.
        jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL; // allow null
        try {
            return jsonConvert.deserializeObject(jsonObj, type);
        } catch (e) {
            logger.error(<Error>e);
            throw (e);
        }
    }

    deserializeArray<T>(jsonArray: Object[], type: any) {
        const jsonConvert: JsonConvert = new JsonConvert();
        jsonConvert.ignorePrimitiveChecks = false; // don"t allow assigning number to string etc.
        jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL; // allow null
        let deserializedArray: Array<T>;
        try {
            deserializedArray = jsonConvert.deserializeArray<T>(jsonArray, type);
            return deserializedArray;
        } catch (e) {
            logger.error(<Error>e);
            throw (e);
        }
    }

}

export default new CommonService();
