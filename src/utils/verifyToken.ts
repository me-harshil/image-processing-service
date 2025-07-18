import { promisify } from "util";
import jwt from "jsonwebtoken";
import config from "@/config/config";

const verifyToken = async (token: string, type = "access") => {
    const verifyAsync = promisify(jwt.verify) as (token: string, secret: string) => Promise<any>;
    const secret = type === "access" ? config.ACCESS_TOKEN_SECRET : config.REFRESH_TOKEN_SECRET;
    const decoded = await verifyAsync(token, secret);
    return decoded;
}

export default verifyToken;