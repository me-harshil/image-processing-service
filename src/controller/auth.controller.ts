import loginController from "@/controller/auth/loginController";
import signupController from "@/controller/auth/signUpController";
import express from "express";

const authController = express.Router();

authController.post("/login", loginController);
authController.post("/signup", signupController);

export default authController;