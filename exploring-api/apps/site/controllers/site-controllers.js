import fetch from "node-fetch";

export const displayInfoDb = async (req, res) => {
    try{
        const response = await fetch("http://localhost:3000/api/site/select-info", {
            method: "GET",
        });
        const result = await response.json();

        res.render("pages/site", {
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

        res.render("pages/details-post/details", {
            post: result.post,
            content: result.content
        });
    }
    catch(error){
        console.error("Error get data: ". error);
        res.redirect("/");
    }
}

export const displayContentSearch = async (req, res) => {
    try{
        const search = req.query.query?.trim() || "";
        const url = new URL("http://localhost:3000/api/site/search");

        if(search){
            url.searchParams.set("query", search);
        }

        const response = await fetch(url.toString(), {
            method: "GET"
        });

        const result = await response.json();
        console.log("Search query: ", result.search_query);

        res.render("pages/site", {
            content: result.content,
            search_query: result.search_query
        });
    }
    catch(err){
        console.error("Erro ao buscar conteúdos: ", err);
    }
}

