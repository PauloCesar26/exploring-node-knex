import express from "express";
import { 
    admin, 
    viewLogin, 
    makeLogin, 
    makeLogout, 
    manageUsers, 
    registerUser, 
    deleteUser, 
    registerView,
    viewPost,
    createContentPost
} from "../controllers/admin-controllers.js";
import { middlewareAuthAdmin } from "../middlewares/middleware-auth.js";

export const adminRouter = express.Router();

adminRouter.get("/", middlewareAuthAdmin, admin);
adminRouter.get("/admin-login", viewLogin);
adminRouter.post("/login", makeLogin);
adminRouter.get("/logout", makeLogout);
adminRouter.get("/manage-user", middlewareAuthAdmin, manageUsers);
adminRouter.get("/register-info", middlewareAuthAdmin, registerView);
adminRouter.post("/register-user", middlewareAuthAdmin, registerUser);
adminRouter.post("/manage-user/:id", deleteUser);
adminRouter.get("/post/:postId/content", middlewareAuthAdmin, viewPost);
adminRouter.post("/post/:postId/content", middlewareAuthAdmin, createContentPost);