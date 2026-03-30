import mysql from "mysql2";

export const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: "",
    database: process.env.DB
});