import User from "@/models/User";
import AppError from "@/utils/appError";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import config from "@/config/config";

type User = { username: string, password: string };

const loginService = async ({ username, password }: User) => {
    const user = await User.findOne({ username });
    if (!user) {
        throw new AppError("username or password is incorrect", 401);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new AppError("username or password is incorrect", 401);
    }

    const token = jwt.sign({ id: user.id }, config.JWT_SECRET_KEY, { expiresIn: config.JWT_EXPIRES_IN } as SignOptions);
    user.password = undefined;
    return {
        status: "success",
        message: "Login successful",
        token,
        data: {
            user,
        }
    }
}

export default loginService;