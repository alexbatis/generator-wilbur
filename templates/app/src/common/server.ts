/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import * as express from "express";
import { InversifyExpressServer, getRouteInfo } from "inversify-express-utils";
import { Container } from "inversify";
import * as path from "path";
import * as bodyParser from "body-parser";
import * as http from "http";
import * as os from "os";
import * as cookieParser from "cookie-parser";
import * as net from "net";
import cookieSession = require("cookie-session");
// import * as passport from "passport";
/* --------------------------------- CUSTOM --------------------------------- */
import "@controllers";
import { logger, swaggerify, mongoDatabase, createContainer } from "@common";
import { controllerService } from "@services";


/* -------------------------------------------------------------------------- */
/*                              CLASS DEFINITION                              */
/* -------------------------------------------------------------------------- */
export class ExpressServerNew {
  /* ---------------------------- MEMBER VARIABLES ---------------------------- */
  app: express.Application;
  container: Container;

  /* ------------------------------- CONSTRUCTOR ------------------------------ */
  constructor() {
    logger.info(`Starting Server in ${process.env.ENV_NAME} environment`);

    this.container = createContainer();               // Create app container
    const server = this.createServer(this.container); // Create server
    this.app = server.build();                        // Create application
    swaggerify(this.app);                             // Generate Swagger docs
  }

  /* --------------------------------- METHODS -------------------------------- */
  private createServer(container: Container) {
    // Create server
    const server = new InversifyExpressServer(container);

    // Configure Server
    server.setConfig((app) => {
      // File path configurations
      const root = path.normalize(__dirname + "/../..");
      app.set("appPath", root + "client");
      app.use("/docs", express.static(`${root}/public/api-explorer`));

      // Body & cookie parsers
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(cookieParser(process.env.SESSION_SECRET));
      app.use(cookieSession({
        name: "asdf",
        secret: "Asdf",
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      }));

      // Disable reject unauthorized
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

      // Passport
      // AuthService.setupPassport();
      // app.use(passport.initialize());
      // app.use(passport.initialize());
      // app.use(passport.session());
    });

    server.setErrorConfig((app) => app.use(controllerService.requestErrorHandler));

    return server;
  }

  // Scan port number to tell if port is available
  isPortTaken(port: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const tester: any = net.createServer()
        .once("error", (err: any) => (err.code == "EADDRINUSE" ? resolve(false) : reject(err)))
        .once("listening", () => tester.once("close", () => resolve(true)).close())
        .listen(port);
    });
  }


  // Make connection to db
  async connectToDB(): Promise<boolean> {
    try {
      await mongoDatabase.connect();
      return true;
    }
    catch (err) {
      logger.fatal(`Error connecting to database. Please make sure database is running. ${err}`);
      process.exit(1);
    }
  }

  listen(port = parseInt(process.env.PORT)): express.Application {
    const welcome = (port: number) => () => logger.info(`Server up and running in ${process.env.ENV_NAME || "development"} environment @: ${os.hostname()} on port ${port}`);
    http.createServer(this.app).listen(port, welcome(port));
    return this.app;
  }

}
