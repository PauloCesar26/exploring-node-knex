import fetch from "node-fetch";

export const viewLogin = (req, res) => {
    res.render("pages/login/login", { errorUser: null, errorPassword: null });
}

export const admin = (req, res) => {
    res.render("pages/index");
}

export const registerView = (req, res) => {
    res.render("pages/register-info/register");
}

export const viewPost = (req, res) => {
    const { postId } = req.params;

    res.render("pages/send-post/post", { postId });
}

export const makeLogin = async (req, res) => {
    const { user, password } = req.body;
    
    try{
        const response = await fetch("http://localhost:3000/api/admin/admin-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user, password }),
        });

        const admin = await response.json();
        console.log(admin);
        console.log("-------------");

        if(!response.ok){
            return res.render("pages/login/login", {
                errorUser: admin.errorUser || null,
                errorPassword: admin.errorPassword || null
            });
        }

        req.session.admin = {
            id: admin.admin.id,
            name: admin.admin.userName,
            token: admin.admin.token
        };
        console.log("Admin session:", req.session.admin);
        return res.redirect("/admin");
    } 
    catch(error){
        console.error("Erro ao fazer login via API:", error);
        return res.status(500).send("Erro interno.");
    }
}

export const makeLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/admin/admin-login");
    });
}

export const manageUsers = async (req, res) => {
    try{
        if(!req.session.admin){
            return res.redirect("/admin/admin-login");
        }

        const response = await fetch("http://localhost:3000/api/admin/manage-user", {
            method: "GET",
            headers: {
                authorization: "Bearer " + req.session.admin.token,
            }
        });

        if(response.status === 401){
            console.log("Token inválido ou expirado");
            return res.redirect("/admin/admin-login");
        }

        const result = await response.json();
        console.log("------ADMIN------");
        console.log(result);

        res.render("pages/admin-manage/admin-user", {
            user: result.user
        });
    }
    catch(error){
        console.error("Error get users: ", error);
        res.redirect("/admin/logout");
    }
}

export const registerUser = async (req, res) => {
    const token = req.session.admin.token;

    try {
        if(!req.session.admin){
            return res.redirect("/admin/admin-login");
        }

        const response = await fetch("http://localhost:3000/api/admin/register-user", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": req.headers["content-type"]
            },
            body: req
        });

        const data = await response.json();

        if(response.status === 401){
            console.log("Token inválido");
            return res.redirect("/admin/admin-login");
        }

        res.redirect(`/admin/post/${data.postId}/content`);
    } 
    catch(err){
        console.error(err);
        res.redirect("/admin/register-info");
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        if(!req.session.admin){
            return res.redirect("/admin/admin-login");
        }

        const response = await fetch(`http://localhost:3000/api/admin/manage-user/${id}`, {
            method: "DELETE",
            headers: {
                authorization: `Bearer ${req.session.admin.token}`,
            },
        });

        if(response.status === 401){
            console.log("Error delete user");
            return res.redirect("/admin/admin-login");
        }

        res.redirect("/admin/manage-user");
    }
    catch(err){
        console.error(err);
        res.redirect("/admin/manage-user");
    }
}

export const createContentPost = async (req, res) => {
    const { postId } = req.params;

    try{
        if(!req.session.admin){
            return res.redirect("/admin/admin-login");
        }

        await fetch(`http://localhost:3000/api/admin/post/${postId}/content`, {
            method: "POST",
            headers: {
                authorization: `Bearer ${req.session.admin.token}`,
                "Content-Type": req.headers["content-type"]
            },
            body: req
        });

        res.redirect(`/admin/post/${postId}/content`);
    }
    catch{
        console.error("Error ao enviar para a API: ", err);
        res.redirect(`/admin/post/${postId}/content`);
    }
}

export const exportDataDb = async (req, res) => {
    console.log("exportDataDb chamado");
    try{
         if(!req.session.admin){
            return res.redirect("/admin/admin-login");
        }

        const response = await fetch("http://localhost:3000/api/admin/export-data", {
            method: "GET",
            headers: {
                authorization: "Bearer " + req.session.admin.token,
            }
        });

        if(response.status === 401){
            console.log("Token inválido ou expirado");
            return res.redirect("/admin/admin-login");
        }

        const buffer = await response.arrayBuffer();

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="data.xlsx"');

        res.send(Buffer.from(buffer));
    }
    catch(err){
        console.log("Erro:", err.message);
        res.status(500).json({ error: err.message });
    }
}