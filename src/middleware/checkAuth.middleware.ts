import catchAsync from "@/utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "@/utils/appError";
import config from "@/config/config";
import User from "@/models/User";
import { logger } from "@/config/logger";
import { promisify } from "util";

const checkAuth = catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    logger.info("Started executing checkAuth middleware");
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        logger.error("You are not logged in! Please log in to get access.");
        return next(new AppError("You are not logged in! Please log in to get access.", 401));
    }

    const verifyAsync = promisify(jwt.verify) as (token: string, secret: string) => Promise<any>;
    const decoded = await verifyAsync(token, config.JWT_SECRET_KEY);
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