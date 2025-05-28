// script.js
const recipeForm = document.getElementById("recipe-form");
const recipesContainer = document.getElementById("recipes");

function getRecipes() {
  return JSON.parse(localStorage.getItem("recipes")) || [];
}

function saveRecipes(recipes) {
  localStorage.setItem("recipes", JSON.stringify(recipes));
}

function renderRecipes() {
  recipesContainer.innerHTML = "";
  const recipes = getRecipes();
  recipes.forEach((recipe, index) => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    const image = document.createElement("img");
    image.src = recipe.image || "assets/default-placeholder.jpg";
    card.appendChild(image);

    const title = document.createElement("h3");
    title.textContent = recipe.title;
    card.appendChild(title);

    const ingredients = document.createElement("p");
    ingredients.textContent = `Ingredients: ${recipe.ingredients.join(", ")}`;
    card.appendChild(ingredients);

    const steps = document.createElement("p");
    steps.textContent = `Steps: ${recipe.steps}`;
    card.appendChild(steps);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => {
      const recipes = getRecipes();
      recipes.splice(index, 1);
      saveRecipes(recipes);
      renderRecipes();
    };
    card.appendChild(delBtn);

    recipesContainer.appendChild(card);
  });
}

recipeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const ingredients = document.getElementById("ingredients").value.split(",").map(i => i.trim());
  const steps = document.getElementById("steps").value;
  const imageInput = document.getElementById("image");

  const reader = new FileReader();
  reader.onload = function () {
    const image = reader.result;
    const newRecipe = { title, ingredients, steps, image };
    const recipes = getRecipes();
    recipes.push(newRecipe);
    saveRecipes(recipes);
    renderRecipes();
    recipeForm.reset();
  };

  if (imageInput.files[0]) {
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    const newRecipe = { title, ingredients, steps, image: null };
    const recipes = getRecipes();
    recipes.push(newRecipe);
    saveRecipes(recipes);
    renderRecipes();
    recipeForm.reset();
  }
});

// Initial render
renderRecipes();
