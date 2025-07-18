import catchAsync from "@/utils/catchAsync";
import { logger } from "@/config/logger";
import ApiResponse from "@/utils/ApiResponse";
import User from "@/models/user.model";

const logoutController = catchAsync(async (req, res, next) => {
    logger.info("Started executing logoutController");
    await User.findByIdAndUpdate({ req.user.id }, { $set: { refeshToken: undefined } }, { new: true });
    const cookieOptions = {
        httpOnly: true,
        secure: true
    }
    logger.info("Successfully executed logoutController");
    return res.status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse({}, "User logged out successfully", 200));
});

export default logoutController;