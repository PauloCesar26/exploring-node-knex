import express from "express";
import { displayContentPost, displayInfoDb } from "../controllers/site-controllers.js";

export const siteRouter = express.Router();

siteRouter.get("/:siteSlug", displayInfoDb);
siteRouter.get("/:siteSlug/post/:id", displayContentPost);


