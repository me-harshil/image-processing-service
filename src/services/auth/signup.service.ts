import AppError from "@/utils/appError";
import User from "@/models/user.model";
import jwt, { SignOptions } from "jsonwebtoken";
import config from "@/config/config";


type User = {
    username: string,
    password: string
}
const signupService = async ({ username, password }: User) => {
    const user = await User.findOne({ username });
    if (user) {
        throw new AppError("User already exists", 400);
    }
    const newUser = await User.create({ username, password: password });
    const token = jwt.sign({ id: newUser.id }, config.JWT_SECRET_KEY, { expiresIn: config.JWT_EXPIRES_IN } as SignOptions);
    newUser.password = undefined;
    return {
        status: "success",
        token,
        data: {
            user: newUser,
        }
    }
};

export default signupService;