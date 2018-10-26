import * as middleware from "swagger-express-middleware";
import { Application } from "express";
import * as path from "path";
import { logger } from "../logger";
const resolve = require("json-refs").resolveRefs;
const YAML = require("js-yaml");
const fs = require("fs");


export const swaggerify = function (app: Application, routes: (app: Application) => void) {
  middleware(path.join(__dirname, "Api.yaml"), app, function (err, middleware) {
    app.use(middleware.files(app, {
      apiPath: process.env.SWAGGER_API_SPEC,
    }));
    routes(app);
  });
};
