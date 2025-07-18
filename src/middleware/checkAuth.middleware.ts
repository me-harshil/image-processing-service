import catchAsync from "@/utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import AppError from "@/utils/appError";
import User from "@/models/user.model";
import { logger } from "@/config/logger";
import verifyToken from "@/utils/verifyToken";

const checkAuth = catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    logger.info("Started executing checkAuth middleware");
    let token: string | undefined;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.accessToken) {
        token = req.cookies.accessToken;
    }

    if (!token) {
        logger.error("You are not logged in! Please log in to get access.");
        return next(new AppError("You are not logged in! Please log in to get access.", 401));
    }

    const decoded = await verifyToken(token, "access");
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        logger.error("The user belonging to this token does no longer exist");
        return next(new AppError("The user belonging to this token does no longer exist.", 401));
    }
    req.user = currentUser;
    logger.info("Successfully executed checkAuth middleware");
    next();
});

export default checkAuth;