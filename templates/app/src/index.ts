/*------------------------------IMPORTS------------------------------*/
/*--------------------THIRD PARTY-------------------*/
/*--------------------CUSTOM-------------------*/
import { env, app } from "@common";
import { routes } from "./routes";

const port = parseInt(process.env.PORT);
app.router(routes);
app.connectToDB().then(() => app.listen(port));

export default app;
