import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { siteRouter } from "./routes/site-routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

console.log("Diretório atual (__dirname):", __dirname);

app.use("/site/static", express.static(
  path.join(__dirname, "/public")
));
app.use(express.json());
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
app.use("/", siteRouter);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.listen(3002, () => {
  console.log("Site rodando em http://localhost:3002");
});