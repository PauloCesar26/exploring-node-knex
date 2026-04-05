import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { dbKnex } from "./database/db-connection.js";
import { apiAdminRouter } from "./routes-api/admin-routes.js";
import { apiSiteRouter } from "./routes-api/website-routes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use("/uploads-content", express.static("uploads-content"));

async function startServer(){
  try{
    await dbKnex.raw("SELECT 1");

    console.log("Conectado ao MySQL.");

    app.listen(3000, () => {
      console.log("Servidor rodando em http://localhost:3000");
    });
  }
  catch(err){
    console.error("Erro ao conectar no banco:", err);
  }
};

app.use("/api/admin", apiAdminRouter);
app.use("/api/site", apiSiteRouter);

startServer();