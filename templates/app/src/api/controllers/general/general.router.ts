import * as express from "express";
import { generalController } from "@controllers";

export const GeneralRouter = express.Router()
    .get("/", generalController.handleRoot);
