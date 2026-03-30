import express from "express";
import { adminMakeLogin, adminRegisterUser, adminManageUsers, adminDeleteUser, adminCreateContentPost } from "../controllers-api/admin-controllers.js";
import { upload } from "../multer/multer-config.js";
import { uploadContent } from "../multer/multer-config-content.js";
import { middlewareAuthJwt } from "../middlewares/auth-jwt.js";

export const apiAdminRouter = express.Router();

apiAdminRouter.post("/admin-login", adminMakeLogin);
apiAdminRouter.get("/manage-user", middlewareAuthJwt, adminManageUsers);
apiAdminRouter.post("/register-user", middlewareAuthJwt, upload.single("userImg"), adminRegisterUser);
apiAdminRouter.delete("/manage-user/:id", middlewareAuthJwt, adminDeleteUser);
apiAdminRouter.post("/post/:postId/content", middlewareAuthJwt, uploadContent.single("image"), adminCreateContentPost);