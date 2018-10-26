import { Application } from "express";
import {
  GeneralRouter,
  ApiRootRouter
} from "@controllers";

export const routes = function (app: Application): void {
  app.use("/", GeneralRouter);
  app.use("/api/v1/", ApiRootRouter);
};
