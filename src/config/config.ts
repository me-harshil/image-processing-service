import dotenv from "dotenv";
import z from "zod";

dotenv.config({ debug: false, path: "./.env", encoding: "utf8" })

const envVarSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DATABASE: z.string().min(1, { message: "The connection string for the database is required" }),
    PORT: z.coerce.number().default(3000),
    JWT_SECRET_KEY: z.string().min(1, { message: "The JWT secret is required" }),
    JWT_EXPIRES_IN: z.string().or(z.number()).refine((value) => typeof value === "string" || value > 0, { message: "The JWT expiration time must be a positive number or a string" }),
})

const parsedEnv = envVarSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.log("Invalid environment variables");
    console.error(parsedEnv.error.format());
    process.exit(1);
}

const config = parsedEnv.data;

export default config;
