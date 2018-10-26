/*--------------------THIRD PARTY-------------------*/
import { Request, Response, NextFunction } from "express";
import { ABError, errorHandler } from "@models";
/*--------------------CUSTOM-------------------*/

class ControllerService {
    /*--------------------CONSTRUCTOR----------------------------------*/
    constructor() { }
    /*--------------------FUNCTIONS------------------------------------*/
    // parse errors and send them as a response
    handleError(err: any, res: Response) {

        try {
            // if error being handled has options or response, strip them out in order to hide api request credentials in error response body
            delete err["options"];
            delete err["headers"];
            delete err["response"];

            // if the error message is in json, parse it instead of returning it as a string
            let errMsg = JSON.parse(JSON.stringify(err)).error;
            if (this.isJSONParsable(errMsg)) {
                errMsg = JSON.parse(errMsg);
                err["message"] = errMsg;
            }
        }
        catch (e) { /*couldnt parse error message, no big deal just continue*/ }

        // de-serialize error and send it in a response body
        if (!(err instanceof ABError))
            err = errorHandler.handleError(err);
        res.status(err.status).json(err);
    }

    private isJSONParsable(text: string) {
        return (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, "@")
            .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
            .replace(/(?:^|:|,)(?:\s*\[)+/g, "")))
            ? true
            : false;
    }

    assessErrors(req: Request, res: Response, next: NextFunction, errors: any, message?: string) {
        if (!message) message = "please make a valid request";
        if (errors) {
            const err = errorHandler.handleError(errors, `Bad request: ${message}`, 400);
            res.status(err.status).send(err);
        }
        else
            next();
    }
}

// Exported Instance
export const controllerService = new ControllerService();

