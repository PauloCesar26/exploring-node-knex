
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM carregado");

  const dropdowns = document.querySelectorAll(".dropdown");

  console.log("Dropdowns encontrados:", dropdowns.length);

  dropdowns.forEach((dropdown) => {
    const button = dropdown.querySelector(".dropdown-button");
    const menu = dropdown.querySelector(".dropdown-menu");

    console.log(button, menu);
    button.addEventListener("click", () => {
    console.log("clicou");
    menu.classList.toggle("hidden");
    });
  });
});