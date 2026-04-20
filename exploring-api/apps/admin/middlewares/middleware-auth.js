export function middlewareAuthAdmin(req, res, next){
    if(!req.session.admin){
        return res.redirect("/admin/admin-login");
    }
    next();
}