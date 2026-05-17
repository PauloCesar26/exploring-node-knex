import express from "express";
import { 
    adminMakeLogin, 
    adminRegisterUser, 
    adminManageUsers, 
    adminDeleteUser, 
    adminCreateContentPost, 
    exportDataDb 
} from "../controllers-api/admin-controllers.js";
import { middlewareAuthJwt } from "../middlewares/auth-jwt.js";
import { createUpload } from "../multer/multer-config.js";

export const apiAdminRouter = express.Router();
const upload = createUpload("./uploads");
const uploadContent = createUpload("./uploads-content");

apiAdminRouter.post("/admin-login", adminMakeLogin);
apiAdminRouter.get("/manage-user", middlewareAuthJwt, adminManageUsers);
apiAdminRouter.post("/register-user", middlewareAuthJwt, upload.single("userImg"), adminRegisterUser);
apiAdminRouter.delete("/manage-user/:id", middlewareAuthJwt, adminDeleteUser);
apiAdminRouter.post("/post/:postId/content", middlewareAuthJwt, uploadContent.single("image"), adminCreateContentPost);
apiAdminRouter.get("/export-data", middlewareAuthJwt, exportDataDb);