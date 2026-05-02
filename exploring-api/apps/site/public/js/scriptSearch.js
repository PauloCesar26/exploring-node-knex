const searchInput = document.getElementById("search");
const buttonSearch = document.getElementById("buttonSearch");
const userList = document.getElementById("userList");

const buildCard = (users) => `
  <div class="bg-zinc-200 border-2 border-zinc-300 hover:border-black flex flex-col max-md:w-[300px] w-[320px] rounded-[15px] overflow-hidden">
    <div class="flex flex-col w-full h-[50%] bg-zinc-900">
      <img src="${users.userImg}">
    </div>
    <div class="flex-1 p-4 text-[1.1rem]">
      <p>${users.nome}</p>
      <p>${users.email}</p>
    </div>
    <div class="p-2 flex justify-end">
      <a href="/post/${users.id}" class="h-10 p-3 bg-zinc-500 text-white font-medium rounded-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl flex items-center justify-center cursor-pointer">
        Detalhes
      </a>
    </div>
  </div>
`;

const searchUsers = async (query) => {
  try{
    const url = new URL("http://localhost:3000/api/site/search");

    if(query){
      url.searchParams.set("query", query);
    }

    const response = await fetch(url.toString());
    const result = await response.json();
    const users = result.user;

    if(!users || users.length === 0){
      userList.innerHTML = "<li class='text-white'>Nenhum post encontrado</li>";
      return;
    }

    userList.innerHTML = users.map(buildCard).join("");
  }
  catch(err){
    console.error("Erro ao buscar post: ", err);
  }
}

buttonSearch.addEventListener("click", () => {
  searchUsers(searchInput.value.trim());
});