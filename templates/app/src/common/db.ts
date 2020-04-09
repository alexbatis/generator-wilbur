/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import * as mongoose from "mongoose";
/* --------------------------------- CUSTOM --------------------------------- */
import { logger } from "@common";


/* -------------------------------------------------------------------------- */
/*                              CLASS DEFINITION                              */
/* -------------------------------------------------------------------------- */
export class MongoDatabase {

    /* --------------------------------- METHODS -------------------------------- */
    async connect(): Promise<boolean> {
        // Grab credentials & server information from environment configuration
        const { MONGO_USER, MONGO_PASS, MONGO_HOST, MONGO_PORT, MONGO_DB } = process.env,
            userPassCombination = (MONGO_USER && MONGO_PASS) ? `${MONGO_USER}:${MONGO_PASS}@` : "",
            mongoUrl = `mongodb://${userPassCombination}${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

        // Connect to MongoDB
        logger.info(`Connected to mongodb at ${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`);

        mongoose.set("useCreateIndex", true);
        await mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

        logger.info(`Connected to mongodb at ${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`);
        return true;
    }

}

// Exported Instance
export const mongoDatabase = new MongoDatabase();
