import { NextFunction, Request, Response } from "express";
import { authService } from "@/services";
import { logger } from "@/config/logger";
import catchAsync from "@/utils/catchAsync";

const loginController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    logger.info("Started executing loginController");
    const { username, password } = req.body;
    const response = await authService.loginService({ username, password });
    logger.info("Successfully executed loginController");
    res.cookie('jwt', response.token);
    return res.status(200).json(response);
})

export default loginController;