/* app.js
   A small recipe manager using localStorage.
   Features:
   - Add / Edit / Delete recipes
   - Save images as base64 Data URLs
   - Search + filter
   - Export / Import JSON
*/

(() => {
  // Keys
  const STORAGE_KEY = "recipe_box_v1";

  // Elements
  const recipesGrid = document.getElementById("recipesGrid");
  const storageInfo = document.getElementById("storageInfo");
  const addRecipeBtn = document.getElementById("addRecipeBtn");
  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("closeModal");
  const cancelBtn = document.getElementById("cancelBtn");
  const recipeForm = document.getElementById("recipeForm");
  const modalTitle = document.getElementById("modalTitle");
  const recipeIdInput = document.getElementById("recipeId");
  const titleInput = document.getElementById("title");
  const mealTypeInput = document.getElementById("mealType");
  const prepTimeInput = document.getElementById("prepTime");
  const instructionsInput = document.getElementById("instructions");
  const imageInput = document.getElementById("imageInput");
  const imagePreview = document.getElementById("imagePreview");
  const ingredientsList = document.getElementById("ingredientsList");
  const newIngredient = document.getElementById("newIngredient");
  const addIngredientBtn = document.getElementById("addIngredientBtn");
  const searchInput = document.getElementById("searchInput");
  const filterSelect = document.getElementById("filterSelect");
  const detailDrawer = document.getElementById("detailDrawer");
  const detailContent = document.getElementById("detailContent");
  const closeDrawer = document.getElementById("closeDrawer");
  const exportBtn = document.getElementById("exportBtn");
  const importBtn = document.getElementById("importBtn");
  const importFile = document.getElementById("importFile");

  // In-memory list
  let recipes = [];
  let currentImageDataURL = null;
  let currentIngredients = [];

  // Utility: generate ID
  const uid = () => 'r_' + Math.random().toString(36).slice(2, 9);

  // Load / Save
  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      recipes = raw ? JSON.parse(raw) : [];
    } catch (e) {
      recipes = [];
      console.error("Failed to parse storage", e);
    }
  }
  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    updateStorageInfo();
  }

  // Initialize sample recipes if empty
  function ensureSampleData() {
    if (recipes.length === 0) {
      const sample = [
        {
          id: uid(),
          title: "Classic Pancakes",
          mealType: "breakfast",
          prepTime: 20,
          ingredients: ["1½ cups flour", "1 tbsp sugar", "1 tsp baking powder", "1 egg", "1 cup milk"],
          instructions: "1. Mix dry ingredients.\n2. Add egg and milk; whisk until smooth.\n3. Cook on a hot griddle until golden.",
          image: null,
          createdAt: Date.now()
        },
        {
          id: uid(),
          title: "Tomato Basil Pasta",
          mealType: "dinner",
          prepTime: 25,
          ingredients: ["200g pasta", "2 cups cherry tomatoes", "handful basil", "2 cloves garlic", "olive oil"],
          instructions: "1. Boil pasta.\n2. Sauté garlic & tomatoes, toss pasta and basil.\n3. Serve with olive oil and pepper.",
          image: null,
          createdAt: Date.now()
        }
      ];
      recipes = sample;
      saveToStorage();
    }
  }

  // Render functions
  function renderRecipes(filter = {}) {
    const q = (filter.query || "").toLowerCase().trim();
    const meal = filter.meal || "all";
    recipesGrid.innerHTML = "";

    const filtered = recipes
      .filter(r => {
        if (meal !== "all" && r.mealType !== meal) return false;
        if (!q) return true;
        const hay = (r.title + " " + (r.ingredients || []).join(" ") + " " + (r.instructions || "")).toLowerCase();
        return hay.includes(q);
      })
      .sort((a,b) => b.createdAt - a.createdAt);

    if (filtered.length === 0) {
      recipesGrid.innerHTML = `<div class="card"><h3 style="color:var(--muted)">No recipes found</h3><p class="meta">Try adding one using "Add Recipe".</p></div>`;
      return;
    }

    for (const r of filtered) {
      const el = document.createElement("article");
      el.className = "card";
      el.dataset.id = r.id;
      el.innerHTML = `
        <div class="thumb">${r.image ? `<img alt="${escapeHtml(r.title)}" src="${r.image}" />` : `<div style="padding:18px;color:var(--muted)">No image</div>`}</div>
        <h3>${escapeHtml(r.title)}</h3>
        <div class="meta">${escapeHtml(r.mealType)} • ${r.prepTime} min</div>
      `;
      // open details on click
      el.addEventListener("click", e => openDetail(r.id));
      recipesGrid.appendChild(el);
    }
  }

  function updateStorageInfo(){
    storageInfo.textContent = `${recipes.length} recipe${recipes.length !== 1 ? 's' : ''}`;
  }

  // Modal handlers
  function openModal(editId = null) {
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    if (editId) {
      modalTitle.textContent = "Edit Recipe";
      const r = recipes.find(x => x.id === editId);
      if (!r) return;
      recipeIdInput.value = r.id;
      titleInput.value = r.title;
      mealTypeInput.value = r.mealType;
      prepTimeInput.value = r.prepTime || "";
      instructionsInput.value = r.instructions || "";
      currentImageDataURL = r.image || null;
      currentIngredients = Array.isArray(r.ingredients) ? r.ingredients.slice() : [];
      renderIngredients();
      renderImagePreview();
    } else {
      modalTitle.textContent = "Add Recipe";
      recipeForm.reset();
      recipeIdInput.value = "";
      currentImageDataURL = null;
      currentIngredients = [];
      renderIngredients();
      renderImagePreview();
    }
  }
  function closeModalFn() {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  }

  // Ingredients UI
  function renderIngredients() {
    ingredientsList.innerHTML = "";
    for (let i = 0; i < currentIngredients.length; i++) {
      const ing = currentIngredients[i];
      const pill = document.createElement("div");
      pill.className = "ingredient-pill";
      pill.innerHTML = `<span>${escapeHtml(ing)}</span><button data-i="${i}" title="Remove">✕</button>`;
      pill.querySelector("button").addEventListener("click", e => {
        const idx = Number(e.target.dataset.i);
        currentIngredients.splice(idx, 1);
        renderIngredients();
      });
      ingredientsList.appendChild(pill);
    }
  }

  addIngredientBtn.addEventListener("click", () => {
    const v = newIngredient.value.trim();
    if (!v) return;
    currentIngredients.push(v);
    newIngredient.value = "";
    renderIngredients();
  });

  newIngredient.addEventListener("keydown", (e)=>{
    if (e.key === "Enter") {
      e.preventDefault();
      addIngredientBtn.click();
    }
  })

  // Image handling
  imageInput.addEventListener("change", async (ev) => {
    const file = ev.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Please choose an image file.");
    currentImageDataURL = await fileToDataURL(file);
    renderImagePreview();
  });

  function renderImagePreview() {
    imagePreview.innerHTML = "";
    if (!currentImageDataURL) {
      imagePreview.innerHTML = `<div style="color:var(--muted)">No image chosen</div>`;
      return;
    }
    const img = document.createElement("img");
    img.src = currentImageDataURL;
    imagePreview.appendChild(img);
  }

  // Form submit
  recipeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = recipeIdInput.value || uid();
    const title = titleInput.value.trim();
    const mealType = mealTypeInput.value;
    const prepTime = Number(prepTimeInput.value) || 0;
    const instructions = instructionsInput.value.trim();

    if (!title || !instructions) {
      alert("Please fill required fields (title and instructions).");
      return;
    }

    const recipe = {
      id,
      title,
      mealType,
      prepTime,
      ingredients: currentIngredients.slice(),
      instructions,
      image: currentImageDataURL,
      createdAt: Date.now()
    };

    const existing = recipes.findIndex(r => r.id === id);
    if (existing >= 0) {
      recipes[existing] = recipe;
    } else {
      recipes.push(recipe);
    }
    saveToStorage();
    renderRecipes({ query: searchInput.value, meal: filterSelect.value });
    closeModalFn();
  });

  // Open details drawer
  function openDetail(id) {
    const r = recipes.find(x => x.id === id);
    if (!r) return;
    detailDrawer.classList.remove("hidden");
    detailDrawer.setAttribute("aria-hidden", "false");
    detailContent.innerHTML = `
      <img src="${r.image || ''}" alt="${escapeHtml(r.title)}" onerror="this.style.display='none'"/>
      <h2>${escapeHtml(r.title)}</h2>
      <div class="meta">${escapeHtml(r.mealType)} • ${r.prepTime} min</div>
      <h4>Ingredients</h4>
      <ul>${(r.ingredients || []).map(i => `<li>${escapeHtml(i)}</li>`).join("")}</ul>
      <h4>Instructions</h4>
      <pre style="white-space:pre-wrap; font-family:inherit; color:var(--muted)">${escapeHtml(r.instructions)}</pre>
      <div style="display:flex; gap:8px; margin-top:12px">
        <button id="editBtn" class="btn primary">Edit</button>
        <button id="deleteBtn" class="btn">Delete</button>
        <button id="closeDetailBtn" class="btn">Close</button>
      </div>
    `;

    // wire up buttons
    document.getElementById("editBtn").addEventListener("click", () => {
      openModal(r.id);
      detailDrawer.classList.add("hidden");
      detailDrawer.setAttribute("aria-hidden", "true");
    });

    document.getElementById("deleteBtn").addEventListener("click", () => {
      if (!confirm(`Delete recipe "${r.title}"? This can't be undone.`)) return;
      recipes = recipes.filter(x => x.id !== r.id);
      saveToStorage();
      renderRecipes({ query: searchInput.value, meal: filterSelect.value });
      detailDrawer.classList.add("hidden");
      detailDrawer.setAttribute("aria-hidden", "true");
    });

    document.getElementById("closeDetailBtn").addEventListener("click", () => {
      detailDrawer.classList.add("hidden");
      detailDrawer.setAttribute("aria-hidden", "true");
    });
  }

  // Search / filter
  searchInput.addEventListener("input", () => {
    renderRecipes({ query: searchInput.value, meal: filterSelect.value });
  });
  filterSelect.addEventListener("change", () => {
    renderRecipes({ query: searchInput.value, meal: filterSelect.value });
  });

  // Buttons
  addRecipeBtn.addEventListener("click", () => openModal());
  closeModal.addEventListener("click", closeModalFn);
  cancelBtn.addEventListener("click", closeModalFn);

  closeDrawer.addEventListener("click", () => {
    detailDrawer.classList.add("hidden");
    detailDrawer.setAttribute("aria-hidden", "true");
  });

  // Export / Import
  exportBtn.addEventListener("click", () => {
    const data = JSON.stringify(recipes, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recipes.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  importBtn.addEventListener("click", () => importFile.click());
  importFile.addEventListener("change", async (ev) => {
    const f = ev.target.files[0];
    if (!f) return;
    try {
      const text = await f.text();
      const imported = JSON.parse(text);
      if (!Array.isArray(imported)) throw new Error("Invalid format");
      // merge by id: replace existing ones with same id
      const map = new Map(recipes.map(r => [r.id, r]));
      for (const r of imported) map.set(r.id || uid(), r);
      recipes = Array.from(map.values());
      saveToStorage();
      renderRecipes({ query: searchInput.value, meal: filterSelect.value });
      alert("Import complete.");
    } catch (err) {
      alert("Failed to import: " + err.message);
    } finally {
      importFile.value = "";
    }
  });

  // Helpers
  function fileToDataURL(file) {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });
  }

  function escapeHtml(s) {
    if (!s && s !== 0) return "";
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // Init
  function boot() {
    loadFromStorage();
    ensureSampleData();
    renderRecipes({ query: "", meal: "all" });
    updateStorageInfo();
  }
  boot();

  // Expose a few for debugging (optional)
  window._recipeBox = {
    getAll: () => recipes,
    clear: () => { recipes = []; saveToStorage(); renderRecipes({}); }
  };
})();
