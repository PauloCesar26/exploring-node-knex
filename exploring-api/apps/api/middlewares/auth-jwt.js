import jwt from "jsonwebtoken";

export function middlewareAuthJwt(req, res, next){
    const JWT_SECRET = process.env.JWT_SECRET;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({ message: "Token não autorizado" });
    }

    console.log("-----AUTHAPI------");
    console.log(token);

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        req.adminToken = decoded.id;
        console.log("--All right--");
        next();
    }
    catch{
        return res.status(401).json({
            message: "Token inválido"
        });
    }
}