import express from "express";
import { selectContentPost, selectUsers } from "../controllers-api/website-controllers.js";

export const apiSiteRouter = express.Router();

apiSiteRouter.get("/select-info", selectUsers);
apiSiteRouter.get("/content-post/:id", selectContentPost);