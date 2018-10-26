import { Request, Response } from "express";
import { controllerService } from "@services";
import * as controllers from "@controllers";

export class ApiRootController {
    async handleRoot(req: Request, res: Response) {
        try {
            // extract model keys
            const models = [];
            for (let key in controllers)
                if (controllers.hasOwnProperty(key))
                    if (key.indexOf("Router") !== -1 && key.indexOf("General") === -1 && key.indexOf("ApiRoot") === -1) {
                        key = key.substring(0, key.indexOf("Router")).toLowerCase() + "s";
                        models.push(key);
                    }


            // Build catalog object
            const catalog: any = [
                `${process.env.DOMAIN}`,
                `${process.env.DOMAIN}/docs`
            ];
            models.forEach((model, i) => {
                catalog.push(`${process.env.DOMAIN}/api/v1/${model}`);
            });

            res.json({ endpoints: catalog });
        } catch (err) { controllerService.handleError(err, res); }
    }
}

// Exported Instance
export const apiRootController = new ApiRootController();
