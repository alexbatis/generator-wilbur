import * as express from "express";
import { apiRootController } from "@controllers";

export const ApiRootRouter = express.Router()
    .get("/", apiRootController.handleRoot);
