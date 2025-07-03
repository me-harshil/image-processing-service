import mongoose, { ConnectOptions } from "mongoose";
import config from "@/config/config";
import { logger } from "@/config/logger";

const { connection, connect } = mongoose;
const connectDB = async () => {
    try {
        // Check if Mongoose is already connected or connecting
        // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
        if (connection.readyState === 1 || connection.readyState === 2) {
            logger.info("Database is already connected or connecting, skipping re-connection.");
            return;
        }
        const mongoURI: string = config.DATABASE;
        const options: ConnectOptions = {
            autoIndex: true,
            autoCreate: true
        };

        await connect(mongoURI, options);
        logger.info("Database connected");

    } catch (error) {
        logger.error(error)
        process.exit(1);
    }
}

export default connectDB;