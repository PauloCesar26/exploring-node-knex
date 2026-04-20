import knex from "knex";

export const dbKnex = knex({
    client: "mysql2",
    connection: {
        host: process.env.HOST,
        user: process.env.DB_USER,
        password: process.env.PASSWORD,
        database: process.env.DB
    },
    pool: {
        min: 2,
        max: 10
    }
});