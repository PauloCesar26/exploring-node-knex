import fetch from "node-fetch";

export const displayInfoDb = async (req, res) => {
    try{
        const response = await fetch("http://localhost:3000/api/site/select-info", {
            method: "GET",
        });
        const result = await response.json();
        console.log("-------------");
        console.log(result);

        res.render("site/src/pages/site", {
            user: result.user
        });
    }
    catch(error){
        console.error("Error get data: ". error);
    }
}

export const displayContentPost = async (req, res) => {
    const { id } = req.params;

    try{
        const response = await fetch(`http://localhost:3000/api/site/content-post/${id}`, {
            method: "GET",
        });
        const result = await response.json();
        console.log("-------------");
        console.log(result);

        res.render("site/src/pages/details-post/details", {
            post: result.post,
            content: result.content
        });
    }
    catch(error){
        console.error("Error get data: ". error);
        res.redirect("/");
    }
}

