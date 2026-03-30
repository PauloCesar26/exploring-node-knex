import { db } from "../database/db-connection.js";

export const selectUsers = (req, res) => {
    const sql = "SELECT * FROM infoUsers";

    db.query(sql, (err, result) => {
        if(err){
            console.error("Erro ao buscar dados: ", err);
            return res.status(500).send(err);
        }
        else{
            res.json({
                user: result
            });
        }
    });
}

export const selectContentPost = (req, res) => {
    const { id } = req.params;

    const sqlPost = "SELECT * FROM infoUsers WHERE id = ?";
    const sqlContent = "SELECT * FROM content_post WHERE id_card = ? ORDER BY position_content ASC";

    db.query(sqlPost, [id], (err, result) => {
        if(result.length === 0){
            console.error("Erro ao buscar o post: ", err);
            return res.status(404).json({message: "Post não encontrado"});
        }

        db.query(sqlContent, [id], (err, content) => {
            res.json({
                post: result[0],
                content: content 
            });
        });
    });
}