import * as mongoose from "mongoose";
import * as bluebird from "bluebird";
import { logger } from "@common";

class MongoDatabase {
    constructor() { }

    async connect(): Promise<boolean> {
        // grab credentials & server information from environment configuration
        const MONGO_USER = process.env.MONGO_USER;
        const MONGO_PASS = process.env.MONGO_PASS;
        const MONGO_HOST = process.env.MONGO_HOST;
        const MONGO_PORT = process.env.MONGO_PORT;
        const MONGO_DB = process.env.MONGO_DB;
        const userPassCombination = (MONGO_USER && MONGO_PASS) ? `${MONGO_USER}:${MONGO_PASS}@` : "";

        // construct url to connect to mongodb
        const mongoUrl = `mongodb://${userPassCombination}${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

        // perform connection
        await mongoose.connect(mongoUrl, { useNewUrlParser: true });

        logger.info(`Connected to mongodb at ${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`);
        return true;
    }

}

// Exported Instance
export const mongoDatabase = new MongoDatabase();
