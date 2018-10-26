/*--------------------THIRD PARTY-------------------*/
import * as express from "express";
import { Application } from "express";
import * as path from "path";
import * as expressValidator from "express-validator";
import * as bodyParser from "body-parser";
import * as http from "http";
import * as os from "os";
import * as cookieParser from "cookie-parser";
import * as net from "net";
import * as passport from "passport";
import cookieSession = require("cookie-session");
/*--------------------CUSTOM-------------------*/
import { logger, swaggerify, mongoDatabase } from "@common";
// import AuthService from "../api/services/auth/auth.service";
/*------------------------------MODULE CONSTANTS---------------------*/


/*------------------------------MODULE DEFINITION--------------------*/
class ExpressServer {
  app = express();
  /*--------------------CONSTRUCTOR----------------------------------*/
  constructor() {
    const root = path.normalize(__dirname + "/../..");
    this.app.set("this.appPath", root + "client");
    this.app.use(expressValidator());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cookieParser(process.env.SESSION_SECRET));
    // this.app.use(express.static(`${root}/public`));
    this.app.use("/docs", express.static(`${root}/public/api-explorer`));
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    this.app.use(cookieSession({
      name: "asdf",
      secret: "Asdf",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }));

    // AuthService.setupPassport();
    this.app.use(passport.initialize());
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    // this.app.use((req, res, next) => {
    //   res.locals.user = req.user;
    //   next();
    // });

    logger.info(`Starting Server in ${process.env.ENV_NAME} environment`);
  }

  /*--------------------FUNCTIONS------------------------------------*/
  isPortTaken(port: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const tester: any = net.createServer()
        .once("error", (err: any) => (err.code == "EADDRINUSE" ? resolve(false) : reject(err)))
        .once("listening", () => tester.once("close", () => resolve(true)).close())
        .listen(port);
    });
  }

  // Registers this.app with router & swagger docs
  router(routes: (app: Application) => void): ExpressServer {
    swaggerify(this.app, routes);
    return this;
  }

  // makes connection to db
  async connectToDB(): Promise<boolean> {
    try {
      const connected: boolean = await mongoDatabase.connect();
      return true;
    }
    catch (err) {
      logger.fatal(`Error connecting to database. Please make sure database is running. ${err}`);
      process.exit(1);
    }
  }

  listen(port = parseInt(process.env.PORT)): Application {
    const welcome = (port: number) => () => logger.info(`Server up and running in ${process.env.ENV_NAME || "development"} environment @: ${os.hostname()} on port: ${port}}`);
    http.createServer(this.app).listen(port, welcome(port));
    return this.app;
  }
}

export const app = new ExpressServer();