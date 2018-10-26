import { Request, Response } from "express";
import { controllerService } from "@services";

export class GeneralController {
    async handleRoot(req: Request, res: Response) {
        try {
            res.json({
                message: "Server up and running",
                environment: process.env.ENV_NAME,
                docs: `${process.env.DOMAIN}/docs`,
                api : `${process.env.DOMAIN}/api/v1/`
            });
        } catch (err) { controllerService.handleError(err, res); }
    }
}

// Exported Instance
export const generalController = new GeneralController();
