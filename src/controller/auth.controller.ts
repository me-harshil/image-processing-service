import loginController from "@/controller/auth/loginController";
import signupController from "@/controller/auth/signUpController";
import logoutController from "@/controller/auth/logoutController";
import checkAuth from "@/middleware/checkAuth.middleware";
import refreshAccessTokenController from "@/controller/auth/refreshAccessTokenController";
import { Router } from "express";

const authController = Router();

authController.post("/login", loginController);
authController.post("/signup", signupController);
authController.post("/logout", checkAuth, logoutController);
authController.post("/refresh", refreshAccessTokenController);

export default authController;