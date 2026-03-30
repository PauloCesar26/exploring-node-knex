import { db } from "../database/db-connection.js";
import jwt from "jsonwebtoken";

export const adminMakeLogin = (req, res) => {
    const JWT_SECRET = process.env.JWT_SECRET;

    const { user, password } = req.body;
    const sql = "SELECT * FROM adminApp WHERE userName = ?";

    db.query(sql, [user], (err, result) => {
        if(err){
            console.error("Erro ao buscar user name: ", err);
            return res.status(500).send(err);
        }

        if(result.length === 0){
            return res.status(400).json({ 
                errorUser: "Invalid username",
                errorPassword: null 
            });
        }

        const admin = result[0];
        
        if(password !== admin.userPassword){
            return res.status(400).json({
                errorUser: null,
                errorPassword: "Invalid password"
            });
        }

        const token = jwt.sign({
            id: admin.id_admin,
        }, JWT_SECRET, {
            expiresIn: "15m"
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
    });
}

export const adminRegisterUser = (req, res) => {
    const { name, email, slug } = req.body;
    const imageName = req.file.filename;
    const imgUrl = `http://localhost:3000/uploads/${imageName}`;
    
    const sql = "INSERT INTO infoUsers (userImg, nome, email, slug) VALUES (?, ?, ?, ?)";

    db.query(sql, [imgUrl, name, email, slug], (err, result) => {
        if(err){
            console.error("Erro ao inserir:", err);
            return res.status(500).json({ error: "Erro ao criar post" });
        }

        return res.status(201).json({
            message: "Post criado com sucesso",
            postId: result.insertId
        });
    });
}

export const adminManageUsers = (req, res) => {
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

export const adminDeleteUser = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM infoUsers WHERE id = ?", [id], (err, result) => {
        if(err){
            console.error("Erro ao deletar: ", err);
        }
        else{
            res.status(200).json({message: "User deleted"});
        }
    });
}

export const adminCreateContentPost = (req, res) => {
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
    
    const sql = "INSERT INTO content_post (id_card, type_content, content, position_content, image) VALUES (?, ?, ?, ?, ?)";

    db.query(sql, [postId, type, content || null, position, imgUrl], (err) => {
        if(err){
            console.error("Error ao enviar conteudo do post: ", err);
            return res.status(500).json({ error: "Erro ao mandar content do post" });
        }
        else{
            res.status(201).json({ message: "Content salvo com sucesso" });
        }
    });
}