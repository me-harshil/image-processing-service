import User from "@/models/user.model";
import ApiResponse from "@/utils/ApiResponse";
import AppError from "@/utils/appError";
import catchAsync from "@/utils/catchAsync";
import verifyToken from "@/utils/verifyToken";


const refreshAccessTokenController = catchAsync(async (req, res, next) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!incomingRefreshToken) {
        throw new AppError("Unauthorized api request", 401);
    }

    const decoded = await verifyToken(incomingRefreshToken, "refresh");

    const user = await User.findById(decoded.id);

    if (!user) {
        throw new AppError("The user belonging to this token does no longer exist", 401);
    }
    if (incomingRefreshToken !== user.refreshToken) {
        throw new AppError("Refresh token has expired. Please log in again", 401);
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const cookieOptions = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(new ApiResponse({}, "User logged in successfully", 200));

});

export default refreshAccessTokenController;