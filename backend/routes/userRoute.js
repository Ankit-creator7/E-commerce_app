import express from "express";
import { loginUser, registerUser, loginAdmin, getUserProfile, updateUserProfile, forgotPassword } from "../controllers/userController.js";
import authUser from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/login", loginUser);
userRouter.post("/register", registerUser);
userRouter.post("/admin", loginAdmin);
userRouter.get("/profile", authUser, getUserProfile);
userRouter.post("/profile", authUser, getUserProfile);
userRouter.post("/update-profile", authUser, updateUserProfile);
userRouter.post("/forgot-password", forgotPassword);

export default userRouter;
