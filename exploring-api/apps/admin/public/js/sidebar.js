
document.addEventListener("DOMContentLoaded", () => {
  const dropdowns = document.querySelectorAll(".dropdown");
  
  console.log("DOM carregado");
  console.log("Dropdowns encontrados:", dropdowns.length);

  dropdowns.forEach((dropdown) => {
    const button = dropdown.querySelector(".dropdown-button");
    const menu = dropdown.querySelector(".dropdown-menu");
    const icon = dropdown.querySelector(".dropdown-icon");

    console.log(button, menu);
    button.addEventListener("click", () => {
      console.log("clicou");
      menu.classList.toggle("hidden");
      icon.classList.toggle("rotate-180");
    });
  });
});