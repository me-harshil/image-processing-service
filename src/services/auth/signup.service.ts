import AppError from "@/utils/appError";
import User from "@/models/User";
import bcrypt from "bcryptjs";
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
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({ username, password: hashPassword });
    const token = jwt.sign({ id: newUser.id }, config.JWT_SECRET_KEY, { expiresIn: config.JWT_EXPIRES_IN } as SignOptions);
    newUser.password = undefined;
    return {
        status: "success",
        data: {
            user: newUser,
            token
        }
    }
};

export default signupService;