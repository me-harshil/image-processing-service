import User from "@/models/user.model";
import AppError from "@/utils/appError";
import jwt, { SignOptions } from "jsonwebtoken";
import config from "@/config/config";

type User = { username: string, password: string };

const loginService = async ({ username, password }: User) => {
    const user = await User.findOne({ username });
    if (!user) {
        throw new AppError("username or password is incorrect", 401);
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
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