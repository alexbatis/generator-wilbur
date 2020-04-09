/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import "reflect-metadata";
/* --------------------------------- CUSTOM --------------------------------- */
import { logger, ExpressServerNew } from "@common";

/* -------------------------------------------------------------------------- */
/*                              MAIN APPLICATION                              */
/* -------------------------------------------------------------------------- */
const app = new ExpressServerNew();         // Create application
app.connectToDB()                           // Connect to DB & start application
    .then(_ => app.listen())
    .catch(err => logger.error("Error connecting to database", err));
