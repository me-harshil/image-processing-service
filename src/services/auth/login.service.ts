import User from "@/models/user.model";
import AppError from "@/utils/appError";

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

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    user.password = undefined;
    user.refreshToken = undefined;

    return {
        user,
        accessToken,
        refreshToken
    }
}

export default loginService;