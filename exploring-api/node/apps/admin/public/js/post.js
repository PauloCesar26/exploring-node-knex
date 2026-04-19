const selectTypeContent = document.getElementById("selectTypeContent");
    const simpleContent = document.getElementById("simple-content");
    const imageContent = document.getElementById("image-content");

    imageContent.style.display = "none";

    selectTypeContent.addEventListener("change", () => {
      const valueSelect = selectTypeContent.value;

      if(valueSelect === "image"){
        simpleContent.style.display = "none";
        imageContent.style.display = "block";
      }
      else{
        simpleContent.style.display = "block";
        imageContent.style.display = "none";
      }
    });