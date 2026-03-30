import jwt from "jsonwebtoken";

export function middlewareAuthJwt(req, res, next){
    const JWT_SECRET = process.env.JWT_SECRET;
    const tokenHeader = req.headers.authorization;

    if(!tokenHeader){
        return res.status(401).json({ message: "Token não autorizado" });
    }

    const token = tokenHeader.split(" ")[1];
    console.log("-----AUTHAPI------");
    console.log(token);

    try{
        req.adminToken = jwt.verify(token, JWT_SECRET);
        console.log("--All right--");
        next();
    }
    catch{
        return res.status(401).json({
            message: "Token inválido"
        });
    }
}