import dotenv from "dotenv";
import z from "zod";

dotenv.config({ debug: false, path: "./.env", encoding: "utf8" })

const envVarSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DATABASE: z.string().min(1, { message: "The connection string for the database is required" }),
    PORT: z.coerce.number().default(3000),
    ACCESS_TOKEN_SECRET: z.string().min(1, { message: "The access token secret is required" }),
    REFRESH_TOKEN_SECRET: z.string().min(1, { message: "The refresh token secret is required" }),
    ACCESS_TOKEN_EXPIRY: z.string().or(z.number()).refine((value) => typeof value === "string" || value > 0, { message: "The access token expiration time must be a positive number or a string" }),
    REFRESH_TOKEN_EXPIRY: z.string().or(z.number()).refine((value) => typeof value === "string" || value > 0, { message: "The refresh token expiration time must be a positive number or a string" }),
    LOG_LEVEL: z.enum(["error", "warn", "info", "http", "verbose", "debug", "silly"]).default("info")
})

const parsedEnv = envVarSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.log("Invalid environment variables");
    console.error(parsedEnv.error.format());
    process.exit(1);
}

const config = parsedEnv.data;

export default config;
