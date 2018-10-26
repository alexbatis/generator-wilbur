import * as middleware from "swagger-express-middleware";
import { Application } from "express";
import * as path from "path";
import { logger } from "../logger";
const resolve = require("json-refs").resolveRefs;
const YAML = require("js-yaml");
const fs = require("fs");


export const swaggerify = function (app: Application, routes: (app: Application) => void) {

// const program = require("commander");

// program
//   .version("2.0.0")
//   .option("-o --output-format [output]",
//     "output format. Choices are \"json\" and \"yaml\" (Default is json)",
//     "json")
//   .usage("[options] <yaml file ...>");

// program.outputFormat = "yaml";

// if (program.outputFormat !== "json" && program.outputFormat !== "yaml") {
//   console.error(program.help());
//   process.exit(1);
// }

// // const file = "./index.yaml";
// const file = path.join(__dirname, "index.yaml");
// console.log(file);

// if (!fs.existsSync(file)) {
//   console.error("File does not exist. (" + file + ")");
//   process.exit(1);
// }

// const root = YAML.safeLoad(fs.readFileSync(file).toString());
// const options = {
//   filter: ["relative", "remote"],
//   loaderOptions: {
//     processContent: function (res: any, callback: any) {
//       callback(null, YAML.safeLoad(res.text));
//     }
//   }
// };

// resolve(root, options).then(function (results: any) {
//   if (program.outputFormat === "yaml") {
//     logger.info("asuh");
//     console.log(YAML.safeDump(results.resolved));
//   } else if (program.outputFormat === "json") {
//     console.log(JSON.stringify(results.resolved, null, 2));
//   }
// });

  middleware(path.join(__dirname, "Api.yaml"), app, function (err, middleware) {
    app.use(middleware.files(app, {
      apiPath: process.env.SWAGGER_API_SPEC,
    }));
    routes(app);
  });
};
