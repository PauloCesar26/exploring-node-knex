import fetch from "node-fetch";

export const displayInfoDb = async (req, res) => {
    const { siteSlug } = req.params;

    try{
        const response = await fetch(
            `http://localhost:3000/api/site/select-info?admin_slug=${siteSlug}` 
        );
        const result = await response.json();

        if(!response.ok){
            return res.status(404).render("pages/site"); 
        }

        res.render("pages/site", {
            user: result.user,
            siteSlug: siteSlug
        });
    }
    catch(error){
        console.error("Error get data: ". error);
    }
}

export const displayContentPost = async (req, res) => {
    const { id, siteSlug } = req.params;

    try{
        const response = await fetch(
            `http://localhost:3000/api/site/content-post/${id}`
        );
        const result = await response.json();

        res.render("pages/details-post/details", {
            post: result.post,
            content: result.content,
            siteSlug: siteSlug
        });
    }
    catch(error){
        console.error("Error get data: ". error);
        res.redirect("/");
    }
}

// If one day I want to do the SSR search bar, reactivate this code code block
// export const displayContentSearch = async (req, res) => {
//     const search = req.query.query?.trim() || "";
//     const url = new URL("http://localhost:3000/api/site/search");
//     const { siteSlug } = req.params;

//     try{
//         if(search){
//             url.searchParams.set("query", search);
//         }

//         const response = await fetch(url.toString(), {
//             method: "GET"
//         });

//         const result = await response.json();
//         console.log("Search query: ", result.search_query);

//         res.render("pages/site", {
//             content: result.content,
//             search_query: result.search_query
//         });
//     }
//     catch(err){
//         console.error("Erro ao buscar conteúdos: ", err);
//     }
// }

