import { dbKnex } from "../database/db-connection.js";
import jwt from "jsonwebtoken";

export const adminMakeLogin = async (req, res) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const { user, password } = req.body;

    try{
        const result = await dbKnex("adminApp")
        .select("*")
        .where({ userName: user});

        if(result.length === 0){
            return res.status(400).json({ 
                errorUser: "Invalid username",
                errorPassword: null 
            }); 
        }

        const admin = result[0]

        if(password !== admin.userPassword){
            return res.status(400).json({
                errorUser: null,
                errorPassword: "Invalid password"
            });
        }

        const token = jwt.sign({
            id: admin.id_admin,
        }, JWT_SECRET, {
            expiresIn: "10m"
        });

        res.status(200).json({
            admin: {
                id: admin.id_admin,
                userName: admin.userName,
                token: token
            }
        });

        console.log("Admin:", admin.userName);
        console.log("Token:", token);
    }
    catch(err){
        console.error("Erro ao buscar admin: ", err);
        return res.status(500).send(err);
    }
}

export const adminRegisterUser = async (req, res) => {
    const { name, email, slug } = req.body;
    const imageName = req.file.filename;
    const imgUrl = `http://localhost:3000/uploads/${imageName}`;
    
    try{
        const [id] = await dbKnex("infoUsers")
        .insert({ 
            userImg: imgUrl, 
            nome: name, 
            email: email, 
            slug: slug
        });

        return res.status(201).json({
            message: "Post criado com sucesso",
            postId: id
        });
    }
    catch(err){
        console.error("Erro ao inserir:", err);
        return res.status(500).json({ error: "Erro ao criar post" });
    }
}

export const adminManageUsers = async (req, res) => {
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

export const adminDeleteUser = async (req, res) => {
    const { id } = req.params;

    try{
        const result = await dbKnex("infoUsers").where({id: id}).delete();
        res.status(200).json({message: "User deleted"});
    }
    catch(err){
        console.error("Erro ao deletar: ", err);
        return res.status(500).json({ 
            message: "Erro interno ao deletar usuário.",
            error: err.message
        });
    }
}

export const adminCreateContentPost = async (req, res) => {
    const { postId } = req.params;
    const { type, content, position } = req.body;
    const imageName = req.file ? req.file.filename : null;
    const imgUrl = `http://localhost:3000/uploads-content/${imageName}`;

    if(type === "image" && !imageName){
        return res.status(400).json({ error: "Imagem obrigatoria" });
    }
    if((type === "text" || type === "title") && !content){
        return res.status(400).json({ error: "Text or title obrigatorio" });
    }

    try{
        const result = await dbKnex("content_post")
        .insert({
            id_card: postId,
            type_content: type,
            content: content || null,
            position_content: position,
            image: imgUrl 
        });

        res.status(201).json({ message: "Content salvo com sucesso" });
    }
    catch(err){
        console.error("Error ao enviar conteudo do post: ", err);
        return res.status(500).json({ error: "Erro ao mandar content do post" });
    }
}