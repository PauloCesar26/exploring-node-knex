import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { siteRouter } from "./routes/site-routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

console.log("Diretório atual (__dirname):", __dirname);

app.use(express.static(path.join(__dirname, "../../../ui/site/public")));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../../../ui"));

app.use("/", siteRouter);

app.listen(3002, () => {
  console.log("Site rodando em http://localhost:3002");
});