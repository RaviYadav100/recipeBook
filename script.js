// Get DOM elements
const form = document.querySelector("form");
const recipeList = document.querySelector("#recipe-list");
const noRecipes = document.getElementById("no-recipes");
const searchBox = document.getElementById("search-box");
const imageInput = document.querySelector("#recipe-image");

// Define recipes array
let recipes = [];

// Handle form submit
function handleSubmit(event) {
    event.preventDefault();

    const nameInput = document.querySelector("#recipe-name");
    const ingrInput = document.querySelector("#recipe-ingredients");
    const methodInput = document.querySelector("#recipe-method");

    const name = nameInput.value.trim();
    const ingredients = ingrInput.value.trim().split(",").map(i => i.trim());
    const method = methodInput.value.trim();
    const imageFile = imageInput.files[0];

    if (name && ingredients.length > 0 && method) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const newRecipe = {
                name,
                ingredients,
                method,
                image: e.target.result // Store image as data URL
            };
            recipes.push(newRecipe);

            // Clear form inputs
            nameInput.value = "";
            ingrInput.value = "";
            methodInput.value = "";
            imageInput.value = "";

            displayRecipes();
        };

        if (imageFile) {
            reader.readAsDataURL(imageFile);
        } else {
            // If no image, add recipe without image
            const newRecipe = { name, ingredients, method, image: null };
            recipes.push(newRecipe);
            displayRecipes();
        }
    }
}

// Display recipes in recipe list
function displayRecipes() {
    recipeList.innerHTML = "";
    recipes.forEach((recipe, index) => {
        const recipeDiv = document.createElement("div");
        recipeDiv.innerHTML = `
            <h3>${recipe.name}</h3>
            <p><strong>Ingredients:</strong></p>
            <ul>${recipe.ingredients.map(ingr => `<li>${ingr}</li>`).join("")}</ul>
            <p><strong>Method:</strong></p>
            <p>${recipe.method}</p>
            ${recipe.image ? `<img src="${recipe.image}" class="recipe-image" alt="Recipe Image">` : ""}
            <button class="delete-button" data-index="${index}">Delete</button>
        `;
        recipeDiv.classList.add("recipe");
        recipeList.appendChild(recipeDiv);
    });

    noRecipes.style.display = recipes.length > 0 ? "none" : "flex";
}

// Handle recipe deletion
function handleDelete(event) {
    if (event.target.classList.contains("delete-button")) {
        const index = event.target.dataset.index;
        recipes.splice(index, 1);
        displayRecipes();
        searchBox.value = "";
    }
}

// Search recipes by search query
function search(query) {
    const filteredRecipes = recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(query.toLowerCase())
    );

    recipeList.innerHTML = "";
    filteredRecipes.forEach(recipe => {
        const recipeEl = document.createElement("div");
        recipeEl.innerHTML = `
            <h3>${recipe.name}</h3>
            <p><strong>Ingredients:</strong></p>
            <ul>${recipe.ingredients.map(ingr => `<li>${ingr}</li>`).join("")}</ul>
            <p><strong>Method:</strong></p>
            <p>${recipe.method}</p>
            ${recipe.image ? `<img src="${recipe.image}" class="recipe-image" alt="Recipe Image">` : ""}
            <button class="delete-button" data-index="${recipes.indexOf(recipe)}">Delete</button>
        `;
        recipeEl.classList.add("recipe");
        recipeList.appendChild(recipeEl);
    });
}

// Add event listeners
form.addEventListener("submit", handleSubmit);
recipeList.addEventListener("click", handleDelete);
searchBox.addEventListener("input", event => search(event.target.value));
