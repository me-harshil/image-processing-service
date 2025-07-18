import AppError from "@/utils/appError";
import User from "@/models/user.model";

type User = {
    username: string,
    password: string
}
const signupService = async ({ username, password }: User) => {
    const user = await User.findOne({ username });
    if (user) {
        throw new AppError("User already exists", 409);
    }
    const newUser = await User.create({ username, password: password });
    const accessToken = newUser.generateAccessToken();
    const refreshToken = newUser.generateRefreshToken();

    newUser.refreshToken = refreshToken;
    await newUser.save({ validateBeforeSave: false });

    newUser.password = undefined;
    newUser.refreshToken = undefined;

    return {
        user:newUser,
        accessToken,
        refreshToken
    }
};

export default signupService;