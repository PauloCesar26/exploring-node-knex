import { dbKnex } from "../database/db-connection.js";

export const selectUsers = async (req, res) => {
    try{
        const result = await dbKnex("infoUsers").select("*");

        res.json({
            user: result
        });
    }
    catch(err){
        console.error("Erro ao buscar dados: ", err);
        return res.status(500).json({ 
            message: "Erro interno ao buscar usuários.",
            error: err.message
        });
    }
}

export const selectContentPost = async (req, res) => {
    const { id } = req.params;

    try{
        const [post, content] = await Promise.all([
            dbKnex("infoUsers").where({ id }).first(),
            dbKnex("content_post").where({ id_card: id}).orderBy("position_content", "asc")
        ]);

        if(!post){
            return res.status(404).json({ message: "Post not found"});
        }

        return res.json({
            post: post,
            content: content 
        });
    }
    catch(err){
        console.error("Erro ao buscar o post: ", err);
        return res.status(404).json({message: "Erro ao buscar o post"});
    }
}