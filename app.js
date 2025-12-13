/* Recipe Master - Professional Recipe Management Platform
   Features:
   - User authentication & profiles
   - Recipe CRUD operations
   - AI recipe generation
   - Favorites & ratings
   - View history tracking
   - Professional UI/UX
*/

(() => {
  // Storage Keys
  const STORAGE_KEYS = {
    RECIPES: "recipe_master_recipes",
    USER: "recipe_master_user",
    HISTORY: "recipe_master_history",
    SETTINGS: "recipe_master_settings",
    API_KEY: "recipe_master_api_key"
  };

  // State
  let currentUser = null;
  let recipes = [];
  let viewHistory = [];
  let settings = { darkMode: true, notifications: false };
  let currentPage = "home";
  let currentTab = "account";

  // DOM Elements
  const elements = {
    // Navigation
    navBtns: document.querySelectorAll(".nav-btn"),
    userName: document.getElementById("userName"),
    logoutBtn: document.getElementById("logoutBtn"),
    
    // Pages
    pages: document.querySelectorAll(".page"),
    homePage: document.getElementById("homePage"),
    profilePage: document.getElementById("profilePage"),
    aiModePage: document.getElementById("aiModePage"),
    
    // Home page
    searchInput: document.getElementById("searchInput"),
    filterSelect: document.getElementById("filterSelect"),
    sortSelect: document.getElementById("sortSelect"),
    recipesGrid: document.getElementById("recipesGrid"),
    addRecipeBtn: document.getElementById("addRecipeBtn"),
    totalRecipes: document.getElementById("totalRecipes"),
    favoriteCount: document.getElementById("favoriteCount"),
    avgPrepTime: document.getElementById("avgPrepTime"),
    
    // Modal
    modal: document.getElementById("modal"),
    closeModal: document.getElementById("closeModal"),
    cancelBtn: document.getElementById("cancelBtn"),
    recipeForm: document.getElementById("recipeForm"),
    modalTitle: document.getElementById("modalTitle"),
    
    // Recipe form
    recipeId: document.getElementById("recipeId"),
    title: document.getElementById("title"),
    mealType: document.getElementById("mealType"),
    difficulty: document.getElementById("difficulty"),
    prepTime: document.getElementById("prepTime"),
    cookTime: document.getElementById("cookTime"),
    servings: document.getElementById("servings"),
    description: document.getElementById("description"),
    instructions: document.getElementById("instructions"),
    calories: document.getElementById("calories"),
    protein: document.getElementById("protein"),
    carbs: document.getElementById("carbs"),
    fat: document.getElementById("fat"),
    imageInput: document.getElementById("imageInput"),
    imagePreview: document.getElementById("imagePreview"),
    ingredientsList: document.getElementById("ingredientsList"),
    newIngredient: document.getElementById("newIngredient"),
    addIngredientBtn: document.getElementById("addIngredientBtn"),
    
    // Detail drawer
    detailDrawer: document.getElementById("detailDrawer"),
    detailContent: document.getElementById("detailContent"),
    closeDrawer: document.getElementById("closeDrawer"),
    
    // Profile page
    profileName: document.getElementById("profileName"),
    profileEmail: document.getElementById("profileEmail"),
    profileRecipeCount: document.getElementById("profileRecipeCount"),
    profileFavoriteCount: document.getElementById("profileFavoriteCount"),
    profileHistoryCount: document.getElementById("profileHistoryCount"),
    tabBtns: document.querySelectorAll(".tab-btn"),
    accountTab: document.getElementById("accountTab"),
    historyTab: document.getElementById("historyTab"),
    favoritesTab: document.getElementById("favoritesTab"),
    settingsTab: document.getElementById("settingsTab"),
    accountForm: document.getElementById("accountForm"),
    accountName: document.getElementById("accountName"),
    accountEmail: document.getElementById("accountEmail"),
    accountBio: document.getElementById("accountBio"),
    historyList: document.getElementById("historyList"),
    favoritesGrid: document.getElementById("favoritesGrid"),
    darkMode: document.getElementById("darkMode"),
    notifications: document.getElementById("notifications"),
    exportDataBtn: document.getElementById("exportDataBtn"),
    importDataBtn: document.getElementById("importDataBtn"),
    importFile: document.getElementById("importFile"),
    
    // AI Mode
    apiKeyInput: document.getElementById("apiKeyInput"),
    toggleApiKey: document.getElementById("toggleApiKey"),
    saveApiKeyBtn: document.getElementById("saveApiKeyBtn"),
    aiPrompt: document.getElementById("aiPrompt"),
    aiMealType: document.getElementById("aiMealType"),
    aiDifficulty: document.getElementById("aiDifficulty"),
    generateRecipeBtn: document.getElementById("generateRecipeBtn"),
    aiResult: document.getElementById("aiResult"),
    aiResultContent: document.getElementById("aiResultContent"),
    aiLoading: document.getElementById("aiLoading"),
    saveAiRecipeBtn: document.getElementById("saveAiRecipeBtn"),
    
    // Login
    loginModal: document.getElementById("loginModal"),
    loginForm: document.getElementById("loginForm"),
    loginName: document.getElementById("loginName"),
    loginEmail: document.getElementById("loginEmail"),
    closeLoginModal: document.getElementById("closeLoginModal")
  };

  let currentIngredients = [];
  let currentImageDataURL = null;
  let generatedRecipe = null;

  // Utility Functions
  const uid = () => 'r_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);

  function escapeHtml(s) {
    if (!s && s !== 0) return "";
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function fileToDataURL(file) {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });
  }

  // Storage Functions
  function loadFromStorage() {
    try {
      const recipesData = localStorage.getItem(STORAGE_KEYS.RECIPES);
      recipes = recipesData ? JSON.parse(recipesData) : [];
      
      const userData = localStorage.getItem(STORAGE_KEYS.USER);
      currentUser = userData ? JSON.parse(userData) : null;
      
      const historyData = localStorage.getItem(STORAGE_KEYS.HISTORY);
      viewHistory = historyData ? JSON.parse(historyData) : [];
      
      const settingsData = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (settingsData) settings = { ...settings, ...JSON.parse(settingsData) };
    } catch (e) {
      console.error("Failed to load from storage", e);
      recipes = [];
      viewHistory = [];
    }
  }

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(recipes));
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(viewHistory));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    }
  }

  function saveApiKey(key) {
    localStorage.setItem(STORAGE_KEYS.API_KEY, key);
  }

  function getApiKey() {
    return localStorage.getItem(STORAGE_KEYS.API_KEY) || "";
  }

  // User Management
  function checkAuth() {
    if (!currentUser) {
      elements.loginModal.classList.remove("hidden");
      return false;
    }
    return true;
  }

  function updateUserDisplay() {
    if (currentUser) {
      elements.userName.textContent = currentUser.name;
      elements.profileName.textContent = currentUser.name;
      elements.profileEmail.textContent = currentUser.email;
      elements.accountName.value = currentUser.name;
      elements.accountEmail.value = currentUser.email;
      elements.accountBio.value = currentUser.bio || "";
    }
  }

  // Navigation
  function showPage(pageName) {
    elements.pages.forEach(p => p.classList.remove("active"));
    elements.navBtns.forEach(btn => btn.classList.remove("active"));
    
    // Convert page name to camelCase for element ID
    let pageId = pageName;
    if (pageName === "ai-mode") {
      pageId = "aiMode";
    }
    
    const pageElement = document.getElementById(pageId + "Page");
    const navBtn = document.querySelector(`[data-page="${pageName}"]`);
    
    if (pageElement) {
      pageElement.classList.add("active");
    } else {
      console.error(`Page element not found: ${pageId}Page`);
    }
    
    if (navBtn) {
      navBtn.classList.add("active");
    }
    
    currentPage = pageName;
    
    if (pageName === "profile") {
      updateProfileStats();
      renderHistory();
      renderFavorites();
    } else if (pageName === "ai-mode") {
      // Refresh API key input when switching to AI mode
      if (elements.apiKeyInput) {
        elements.apiKeyInput.value = getApiKey();
      }
      // Hide any previous results
      if (elements.aiResult) {
        elements.aiResult.classList.add("hidden");
      }
      if (elements.aiLoading) {
        elements.aiLoading.classList.add("hidden");
      }
    }
  }

  function showTab(tabName) {
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    elements.tabBtns.forEach(btn => btn.classList.remove("active"));
    
    const tabElement = document.getElementById(tabName + "Tab");
    const tabBtn = document.querySelector(`[data-tab="${tabName}"]`);
    
    if (tabElement) tabElement.classList.add("active");
    if (tabBtn) tabBtn.classList.add("active");
    
    currentTab = tabName;
  }

  // Recipe Management
  function renderRecipes() {
    const query = (elements.searchInput.value || "").toLowerCase().trim();
    const mealFilter = elements.filterSelect.value;
    const sortBy = elements.sortSelect.value;
    
    elements.recipesGrid.innerHTML = "";

    let filtered = recipes.filter(r => {
      if (mealFilter !== "all" && r.mealType !== mealFilter) return false;
      if (!query) return true;
      const searchText = (r.title + " " + (r.description || "") + " " + 
                         (r.ingredients || []).join(" ") + " " + 
                         (r.instructions || "")).toLowerCase();
      return searchText.includes(query);
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "oldest": return a.createdAt - b.createdAt;
        case "rating": return (b.rating || 0) - (a.rating || 0);
        case "prepTime": return (a.prepTime || 0) - (b.prepTime || 0);
        default: return b.createdAt - a.createdAt;
      }
    });

    if (filtered.length === 0) {
      elements.recipesGrid.innerHTML = `
        <div class="empty-state-card">
          <i class="fas fa-search"></i>
          <h3>No recipes found</h3>
          <p>Try adjusting your search or filters, or add a new recipe!</p>
        </div>
      `;
      return;
    }

    filtered.forEach(recipe => {
      const card = createRecipeCard(recipe);
      elements.recipesGrid.appendChild(card);
    });
  }

  function createRecipeCard(recipe) {
    const el = document.createElement("article");
    el.className = "card";
    el.dataset.id = recipe.id;
    
    const isFavorite = recipe.favorite || false;
    const rating = recipe.rating || 0;
    
    el.innerHTML = `
      <div class="card-header">
        <div class="card-badge">${escapeHtml(recipe.mealType)}</div>
        <button class="btn-icon favorite-btn ${isFavorite ? 'active' : ''}" data-id="${recipe.id}" title="Toggle favorite">
          <i class="fas fa-heart"></i>
        </button>
      </div>
      <div class="thumb">
        ${recipe.image ? 
          `<img alt="${escapeHtml(recipe.title)}" src="${recipe.image}" />` : 
          `<div class="no-image"><i class="fas fa-image"></i></div>`
        }
      </div>
      <div class="card-body">
        <h3>${escapeHtml(recipe.title)}</h3>
        ${recipe.description ? `<p class="card-description">${escapeHtml(recipe.description.substring(0, 80))}${recipe.description.length > 80 ? '...' : ''}</p>` : ''}
        <div class="card-meta">
          <span><i class="fas fa-clock"></i> ${recipe.prepTime || 0} min</span>
          ${recipe.cookTime ? `<span><i class="fas fa-fire"></i> ${recipe.cookTime} min</span>` : ''}
          ${recipe.servings ? `<span><i class="fas fa-users"></i> ${recipe.servings}</span>` : ''}
        </div>
        ${rating > 0 ? `<div class="card-rating"><i class="fas fa-star"></i> ${rating.toFixed(1)}</div>` : ''}
      </div>
    `;

    el.addEventListener("click", (e) => {
      if (!e.target.closest(".favorite-btn") && !e.target.closest(".btn-icon")) {
        openDetail(recipe.id);
      }
    });

    // Favorite button
    const favBtn = el.querySelector(".favorite-btn");
    if (favBtn) {
      favBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFavorite(recipe.id);
      });
    }

    return el;
  }

  function toggleFavorite(recipeId) {
    const recipe = recipes.find(r => r.id === recipeId);
    if (recipe) {
      recipe.favorite = !recipe.favorite;
      saveToStorage();
      renderRecipes();
      updateStats();
      if (currentPage === "profile" && currentTab === "favorites") {
        renderFavorites();
      }
    }
  }

  function openDetail(id) {
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) return;

    // Add to history
    const historyEntry = {
      recipeId: id,
      recipeTitle: recipe.title,
      viewedAt: Date.now()
    };
    viewHistory.unshift(historyEntry);
    if (viewHistory.length > 50) viewHistory = viewHistory.slice(0, 50);
    saveToStorage();

    // Increment view count
    recipe.views = (recipe.views || 0) + 1;
    saveToStorage();

    elements.detailDrawer.classList.remove("hidden");
    elements.detailDrawer.setAttribute("aria-hidden", "false");

    const isFavorite = recipe.favorite || false;
    const rating = recipe.rating || 0;

    elements.detailContent.innerHTML = `
      <div class="detail-header">
        <h2>${escapeHtml(recipe.title)}</h2>
        <div class="detail-actions">
          <button class="btn-icon favorite-btn ${isFavorite ? 'active' : ''}" data-id="${id}">
            <i class="fas fa-heart"></i>
          </button>
          <div class="rating-input">
            <label>Rate:</label>
            <select id="recipeRating" class="rating-select">
              <option value="0">No rating</option>
              <option value="1" ${rating === 1 ? 'selected' : ''}>1 ⭐</option>
              <option value="2" ${rating === 2 ? 'selected' : ''}>2 ⭐⭐</option>
              <option value="3" ${rating === 3 ? 'selected' : ''}>3 ⭐⭐⭐</option>
              <option value="4" ${rating === 4 ? 'selected' : ''}>4 ⭐⭐⭐⭐</option>
              <option value="5" ${rating === 5 ? 'selected' : ''}>5 ⭐⭐⭐⭐⭐</option>
            </select>
          </div>
        </div>
      </div>
      ${recipe.image ? `<img src="${recipe.image}" alt="${escapeHtml(recipe.title)}" class="detail-image" />` : ''}
      <div class="detail-meta">
        <span><i class="fas fa-tag"></i> ${escapeHtml(recipe.mealType)}</span>
        ${recipe.difficulty ? `<span><i class="fas fa-signal"></i> ${escapeHtml(recipe.difficulty)}</span>` : ''}
        <span><i class="fas fa-clock"></i> ${recipe.prepTime || 0} min prep</span>
        ${recipe.cookTime ? `<span><i class="fas fa-fire"></i> ${recipe.cookTime} min cook</span>` : ''}
        ${recipe.servings ? `<span><i class="fas fa-users"></i> Serves ${recipe.servings}</span>` : ''}
        ${recipe.views ? `<span><i class="fas fa-eye"></i> ${recipe.views} views</span>` : ''}
      </div>
      ${recipe.description ? `<p class="detail-description">${escapeHtml(recipe.description)}</p>` : ''}
      ${recipe.calories || recipe.protein ? `
        <div class="nutrition-info">
          <h4>Nutrition (per serving)</h4>
          <div class="nutrition-grid">
            ${recipe.calories ? `<div><strong>${recipe.calories}</strong> <span>Calories</span></div>` : ''}
            ${recipe.protein ? `<div><strong>${recipe.protein}g</strong> <span>Protein</span></div>` : ''}
            ${recipe.carbs ? `<div><strong>${recipe.carbs}g</strong> <span>Carbs</span></div>` : ''}
            ${recipe.fat ? `<div><strong>${recipe.fat}g</strong> <span>Fat</span></div>` : ''}
          </div>
        </div>
      ` : ''}
      <div class="detail-section">
        <h4><i class="fas fa-list"></i> Ingredients</h4>
        <ul class="ingredients-list-detail">
          ${(recipe.ingredients || []).map(ing => `<li>${escapeHtml(ing)}</li>`).join("")}
        </ul>
      </div>
      <div class="detail-section">
        <h4><i class="fas fa-list-ol"></i> Instructions</h4>
        <div class="instructions-text">${escapeHtml(recipe.instructions).replace(/\n/g, '<br>')}</div>
      </div>
      <div class="detail-actions-bottom">
        <button id="editRecipeBtn" class="btn primary"><i class="fas fa-edit"></i> Edit</button>
        <button id="deleteRecipeBtn" class="btn danger"><i class="fas fa-trash"></i> Delete</button>
        <button id="closeDetailBtn" class="btn">Close</button>
      </div>
    `;

    // Wire up buttons
    const favBtn = elements.detailContent.querySelector(".favorite-btn");
    if (favBtn) {
      favBtn.addEventListener("click", () => {
        toggleFavorite(id);
        openDetail(id); // Refresh
      });
    }

    const ratingSelect = elements.detailContent.querySelector("#recipeRating");
    if (ratingSelect) {
      ratingSelect.addEventListener("change", (e) => {
        recipe.rating = parseInt(e.target.value);
        saveToStorage();
        openDetail(id); // Refresh
      });
    }

    document.getElementById("editRecipeBtn").addEventListener("click", () => {
      openModal(id);
      closeDetail();
    });

    document.getElementById("deleteRecipeBtn").addEventListener("click", () => {
      if (confirm(`Delete recipe "${recipe.title}"? This cannot be undone.`)) {
        recipes = recipes.filter(r => r.id !== id);
        saveToStorage();
        renderRecipes();
        closeDetail();
        updateStats();
      }
    });

    document.getElementById("closeDetailBtn").addEventListener("click", closeDetail);
  }

  function closeDetail() {
    elements.detailDrawer.classList.add("hidden");
    elements.detailDrawer.setAttribute("aria-hidden", "true");
  }

  // Modal Functions
  function openModal(editId = null) {
    if (!checkAuth()) return;
    
    elements.modal.classList.remove("hidden");
    elements.modal.setAttribute("aria-hidden", "false");
    
    if (editId) {
      elements.modalTitle.textContent = "Edit Recipe";
      const recipe = recipes.find(r => r.id === editId);
      if (!recipe) return;
      
      elements.recipeId.value = recipe.id;
      elements.title.value = recipe.title || "";
      elements.mealType.value = recipe.mealType || "dinner";
      elements.difficulty.value = recipe.difficulty || "medium";
      elements.prepTime.value = recipe.prepTime || "";
      elements.cookTime.value = recipe.cookTime || "";
      elements.servings.value = recipe.servings || "";
      elements.description.value = recipe.description || "";
      elements.instructions.value = recipe.instructions || "";
      elements.calories.value = recipe.calories || "";
      elements.protein.value = recipe.protein || "";
      elements.carbs.value = recipe.carbs || "";
      elements.fat.value = recipe.fat || "";
      currentImageDataURL = recipe.image || null;
      currentIngredients = Array.isArray(recipe.ingredients) ? recipe.ingredients.slice() : [];
    } else {
      elements.modalTitle.textContent = "Add Recipe";
      elements.recipeForm.reset();
      elements.recipeId.value = "";
      currentImageDataURL = null;
      currentIngredients = [];
    }
    
    renderIngredients();
    renderImagePreview();
  }

  function closeModal() {
    elements.modal.classList.add("hidden");
    elements.modal.setAttribute("aria-hidden", "true");
  }

  function renderIngredients() {
    elements.ingredientsList.innerHTML = "";
    currentIngredients.forEach((ing, i) => {
      const pill = document.createElement("div");
      pill.className = "ingredient-pill";
      pill.innerHTML = `
        <span>${escapeHtml(ing)}</span>
        <button data-i="${i}" class="btn-icon" title="Remove">✕</button>
      `;
      pill.querySelector("button").addEventListener("click", () => {
        currentIngredients.splice(i, 1);
        renderIngredients();
      });
      elements.ingredientsList.appendChild(pill);
    });
  }

  function renderImagePreview() {
    elements.imagePreview.innerHTML = "";
    if (!currentImageDataURL) {
      elements.imagePreview.innerHTML = `<div class="no-image-preview"><i class="fas fa-image"></i> No image</div>`;
      return;
    }
    const img = document.createElement("img");
    img.src = currentImageDataURL;
    elements.imagePreview.appendChild(img);
  }

  // Stats
  function updateStats() {
    elements.totalRecipes.textContent = recipes.length;
    const favorites = recipes.filter(r => r.favorite).length;
    elements.favoriteCount.textContent = favorites;
    
    const totalPrepTime = recipes.reduce((sum, r) => sum + (r.prepTime || 0), 0);
    const avgPrep = recipes.length > 0 ? Math.round(totalPrepTime / recipes.length) : 0;
    elements.avgPrepTime.textContent = avgPrep;
  }

  function updateProfileStats() {
    elements.profileRecipeCount.textContent = recipes.length;
    elements.profileFavoriteCount.textContent = recipes.filter(r => r.favorite).length;
    elements.profileHistoryCount.textContent = viewHistory.length;
  }

  // Profile Functions
  function renderHistory() {
    if (viewHistory.length === 0) {
      elements.historyList.innerHTML = `<p class="empty-state">No viewing history yet.</p>`;
      return;
    }

    elements.historyList.innerHTML = viewHistory.slice(0, 20).map(entry => {
      const date = new Date(entry.viewedAt);
      const recipe = recipes.find(r => r.id === entry.recipeId);
      return `
        <div class="history-item" data-id="${entry.recipeId}">
          <div class="history-info">
            <h4>${escapeHtml(entry.recipeTitle)}</h4>
            <span class="history-date">${date.toLocaleString()}</span>
          </div>
          <button class="btn-icon" title="View recipe"><i class="fas fa-arrow-right"></i></button>
        </div>
      `;
    }).join("");

    elements.historyList.querySelectorAll(".history-item").forEach(item => {
      item.addEventListener("click", () => {
        const id = item.dataset.id;
        showPage("home");
        setTimeout(() => openDetail(id), 100);
      });
    });
  }

  function renderFavorites() {
    const favorites = recipes.filter(r => r.favorite);
    
    if (favorites.length === 0) {
      elements.favoritesGrid.innerHTML = `<p class="empty-state">No favorites yet. Start adding recipes to your favorites!</p>`;
      return;
    }

    elements.favoritesGrid.innerHTML = "";
    favorites.forEach(recipe => {
      const card = createRecipeCard(recipe);
      elements.favoritesGrid.appendChild(card);
    });
  }

  // AI Recipe Generation using Google Gemini API
  async function generateRecipe() {
    // Get API key from input field (in case it was just updated)
    const apiKey = elements.apiKeyInput.value.trim() || getApiKey();
    
    if (!apiKey || apiKey.length < 10) {
      alert("Please enter a valid Gemini API key first! Click 'Save API Key' after entering it.");
      elements.apiKeyInput.focus();
      return;
    }

    const prompt = elements.aiPrompt.value.trim();
    if (!prompt) {
      alert("Please enter a recipe description!");
      elements.aiPrompt.focus();
      return;
    }

    // Disable button during generation
    elements.generateRecipeBtn.disabled = true;
    elements.generateRecipeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    
    elements.aiLoading.classList.remove("hidden");
    elements.aiResult.classList.add("hidden");

    const mealType = elements.aiMealType.value;
    const difficulty = elements.aiDifficulty.value;

    const fullPrompt = `You are a professional chef and recipe writer. Generate a well-formatted recipe in JSON format based on the following request: "${prompt}"

The recipe should be for ${mealType} and have ${difficulty} difficulty level.

Return the recipe in this exact JSON format (no markdown, no code blocks, just pure JSON):
{
  "title": "Recipe title",
  "description": "Brief description",
  "mealType": "${mealType}",
  "difficulty": "${difficulty}",
  "prepTime": number in minutes,
  "cookTime": number in minutes,
  "servings": number,
  "ingredients": ["ingredient 1", "ingredient 2", ...],
  "instructions": "Step-by-step instructions with line breaks",
  "calories": number (optional),
  "protein": number in grams (optional),
  "carbs": number in grams (optional),
  "fat": number in grams (optional)
}

Important: Return ONLY the JSON object, no markdown formatting, no code blocks, no explanations. Make sure all numeric values are actual numbers, not strings.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000
          }
        })
      });

      if (!response.ok) {
        let errorMessage = "Failed to generate recipe";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error?.message || errorMessage;
          if (errorData.error?.status === "INVALID_ARGUMENT" && errorData.error?.message?.includes("API key")) {
            errorMessage = "Invalid API key. Please check your Gemini API key and try again.";
          } else if (errorData.error?.status === "RESOURCE_EXHAUSTED") {
            errorMessage = "API quota exceeded. Please check your Google Cloud account billing.";
          }
        } catch (e) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
        throw new Error("Invalid response from API");
      }
      
      const content = data.candidates[0].content.parts[0].text.trim();
      
      if (!content) {
        throw new Error("Empty response from API");
      }
      
      // Extract JSON from response (handle markdown code blocks if present)
      let jsonContent = content;
      
      // Remove markdown code blocks if present
      if (jsonContent.includes("```")) {
        jsonContent = jsonContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      }
      
      // Try to extract JSON object if wrapped in text
      const jsonMatch = jsonContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonContent = jsonMatch[0];
      }

      let parsedRecipe;
      try {
        parsedRecipe = JSON.parse(jsonContent);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.error("Content received:", jsonContent);
        throw new Error("Failed to parse recipe JSON. The AI response may be malformed. Please try again.");
      }

      // Validate required fields
      if (!parsedRecipe.title || !parsedRecipe.ingredients || !parsedRecipe.instructions) {
        throw new Error("Generated recipe is missing required fields. Please try again.");
      }

      generatedRecipe = {
        ...parsedRecipe,
        id: uid(),
        createdAt: Date.now(),
        // Ensure numeric fields are numbers
        prepTime: parseInt(parsedRecipe.prepTime) || 0,
        cookTime: parseInt(parsedRecipe.cookTime) || 0,
        servings: parseInt(parsedRecipe.servings) || 4,
        calories: parsedRecipe.calories ? parseInt(parsedRecipe.calories) : null,
        protein: parsedRecipe.protein ? parseInt(parsedRecipe.protein) : null,
        carbs: parsedRecipe.carbs ? parseInt(parsedRecipe.carbs) : null,
        fat: parsedRecipe.fat ? parseInt(parsedRecipe.fat) : null,
        // Ensure arrays are arrays
        ingredients: Array.isArray(parsedRecipe.ingredients) ? parsedRecipe.ingredients : []
      };

      // Display result
      elements.aiResultContent.innerHTML = `
        <div class="ai-recipe-preview">
          <h4>${escapeHtml(generatedRecipe.title)}</h4>
          ${generatedRecipe.description ? `<p>${escapeHtml(generatedRecipe.description)}</p>` : ''}
          <div class="ai-recipe-meta">
            <span><i class="fas fa-tag"></i> ${escapeHtml(generatedRecipe.mealType || mealType)}</span>
            <span><i class="fas fa-signal"></i> ${escapeHtml(generatedRecipe.difficulty || difficulty)}</span>
            <span><i class="fas fa-clock"></i> ${generatedRecipe.prepTime || 0} min prep</span>
            ${generatedRecipe.cookTime ? `<span><i class="fas fa-fire"></i> ${generatedRecipe.cookTime} min cook</span>` : ''}
            ${generatedRecipe.servings ? `<span><i class="fas fa-users"></i> Serves ${generatedRecipe.servings}</span>` : ''}
          </div>
          <div class="ai-recipe-details">
            <h5><i class="fas fa-list"></i> Ingredients:</h5>
            <ul>${(generatedRecipe.ingredients || []).map(i => `<li>${escapeHtml(i)}</li>`).join("")}</ul>
            <h5><i class="fas fa-list-ol"></i> Instructions:</h5>
            <div class="instructions-text">${escapeHtml(generatedRecipe.instructions).replace(/\n/g, '<br>')}</div>
            ${(generatedRecipe.calories || generatedRecipe.protein) ? `
              <h5><i class="fas fa-chart-pie"></i> Nutrition (per serving):</h5>
              <div class="nutrition-info">
                <div class="nutrition-grid">
                  ${generatedRecipe.calories ? `<div><strong>${generatedRecipe.calories}</strong> <span>Calories</span></div>` : ''}
                  ${generatedRecipe.protein ? `<div><strong>${generatedRecipe.protein}g</strong> <span>Protein</span></div>` : ''}
                  ${generatedRecipe.carbs ? `<div><strong>${generatedRecipe.carbs}g</strong> <span>Carbs</span></div>` : ''}
                  ${generatedRecipe.fat ? `<div><strong>${generatedRecipe.fat}g</strong> <span>Fat</span></div>` : ''}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      `;

      elements.aiResult.classList.remove("hidden");
    } catch (error) {
      console.error("Recipe generation error:", error);
      let errorMessage = error.message || "An unknown error occurred";
      
      // Show user-friendly error message
      elements.aiResultContent.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-triangle" style="color: var(--danger); font-size: 2rem; margin-bottom: 12px;"></i>
          <h4>Error Generating Recipe</h4>
          <p>${escapeHtml(errorMessage)}</p>
          <p style="margin-top: 12px; font-size: 0.9rem; color: var(--muted);">
            Please check your API key and try again. Make sure you have sufficient credits in your Google Cloud account.
          </p>
        </div>
      `;
      elements.aiResult.classList.remove("hidden");
    } finally {
      elements.aiLoading.classList.add("hidden");
      // Re-enable button
      elements.generateRecipeBtn.disabled = false;
      elements.generateRecipeBtn.innerHTML = '<i class="fas fa-magic"></i> Generate Recipe';
    }
  }

  function saveAiRecipe() {
    if (!generatedRecipe) return;
    
    // Check authentication before saving
    if (!checkAuth()) {
      alert("Please log in to save recipes to your recipe book.");
      return;
    }
    
    recipes.push(generatedRecipe);
    saveToStorage();
    renderRecipes();
    updateStats();
    
    alert("Recipe saved successfully!");
    elements.aiResult.classList.add("hidden");
    elements.aiPrompt.value = "";
    generatedRecipe = null;
    
    // Optionally switch to home page to see the saved recipe
    showPage("home");
  }

  // Event Listeners
  elements.navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const page = btn.dataset.page;
      if (page === "profile") {
        if (!checkAuth()) return;
      }
      // AI mode is accessible without login, but saving requires auth
      showPage(page);
    });
  });

  elements.tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      showTab(btn.dataset.tab);
    });
  });

  elements.searchInput.addEventListener("input", renderRecipes);
  elements.filterSelect.addEventListener("change", renderRecipes);
  elements.sortSelect.addEventListener("change", renderRecipes);
  elements.addRecipeBtn.addEventListener("click", () => openModal());
  elements.closeModal.addEventListener("click", closeModal);
  elements.cancelBtn.addEventListener("click", closeModal);
  elements.closeDrawer.addEventListener("click", closeDetail);

  elements.addIngredientBtn.addEventListener("click", () => {
    const val = elements.newIngredient.value.trim();
    if (val) {
      currentIngredients.push(val);
      elements.newIngredient.value = "";
      renderIngredients();
    }
  });

  elements.newIngredient.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      elements.addIngredientBtn.click();
    }
  });

  elements.imageInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }
    currentImageDataURL = await fileToDataURL(file);
    renderImagePreview();
  });

  elements.recipeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!checkAuth()) return;

    const id = elements.recipeId.value || uid();
    const recipe = {
      id,
      title: elements.title.value.trim(),
      mealType: elements.mealType.value,
      difficulty: elements.difficulty.value,
      prepTime: parseInt(elements.prepTime.value) || 0,
      cookTime: parseInt(elements.cookTime.value) || 0,
      servings: parseInt(elements.servings.value) || 0,
      description: elements.description.value.trim(),
      ingredients: currentIngredients.slice(),
      instructions: elements.instructions.value.trim(),
      image: currentImageDataURL,
      calories: elements.calories.value ? parseInt(elements.calories.value) : null,
      protein: elements.protein.value ? parseInt(elements.protein.value) : null,
      carbs: elements.carbs.value ? parseInt(elements.carbs.value) : null,
      fat: elements.fat.value ? parseInt(elements.fat.value) : null,
      createdAt: Date.now()
    };

    if (!recipe.title || !recipe.instructions) {
      alert("Please fill in required fields (title and instructions).");
      return;
    }

    const existingIndex = recipes.findIndex(r => r.id === id);
    if (existingIndex >= 0) {
      // Preserve favorite and rating when editing
      recipe.favorite = recipes[existingIndex].favorite;
      recipe.rating = recipes[existingIndex].rating;
      recipe.views = recipes[existingIndex].views;
      recipes[existingIndex] = recipe;
    } else {
      recipes.push(recipe);
    }

    saveToStorage();
    renderRecipes();
    updateStats();
    closeModal();
  });

  // Profile form
  elements.accountForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!currentUser) return;

    currentUser.name = elements.accountName.value.trim();
    currentUser.email = elements.accountEmail.value.trim();
    currentUser.bio = elements.accountBio.value.trim();
    
    saveToStorage();
    updateUserDisplay();
    alert("Profile updated successfully!");
  });

  // Settings
  elements.darkMode.checked = settings.darkMode;
  elements.notifications.checked = settings.notifications;

  elements.darkMode.addEventListener("change", (e) => {
    settings.darkMode = e.target.checked;
    saveToStorage();
  });

  elements.notifications.addEventListener("change", (e) => {
    settings.notifications = e.target.checked;
    saveToStorage();
  });

  // Export/Import
  elements.exportDataBtn.addEventListener("click", () => {
    const data = {
      recipes,
      user: currentUser,
      history: viewHistory,
      settings,
      exportDate: Date.now()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `recipe-master-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  elements.importDataBtn.addEventListener("click", () => {
    elements.importFile.click();
  });

  elements.importFile.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (data.recipes) recipes = data.recipes;
      if (data.user) currentUser = data.user;
      if (data.history) viewHistory = data.history;
      if (data.settings) settings = { ...settings, ...data.settings };
      
      saveToStorage();
      updateUserDisplay();
      renderRecipes();
      updateStats();
      alert("Data imported successfully!");
    } catch (err) {
      alert("Failed to import: " + err.message);
    } finally {
      elements.importFile.value = "";
    }
  });

  // AI Mode
  if (elements.apiKeyInput) {
    elements.apiKeyInput.value = getApiKey();
  }

  if (elements.toggleApiKey) {
    elements.toggleApiKey.addEventListener("click", () => {
      const input = elements.apiKeyInput;
      if (!input) return;
      const icon = elements.toggleApiKey.querySelector("i");
      if (input.type === "password") {
        input.type = "text";
        if (icon) {
          icon.classList.remove("fa-eye");
          icon.classList.add("fa-eye-slash");
        }
      } else {
        input.type = "password";
        if (icon) {
          icon.classList.remove("fa-eye-slash");
          icon.classList.add("fa-eye");
        }
      }
    });
  }

  if (elements.saveApiKeyBtn) {
    elements.saveApiKeyBtn.addEventListener("click", () => {
      const key = elements.apiKeyInput.value.trim();
      if (key && key.length >= 10) {
        saveApiKey(key);
        alert("Gemini API key saved successfully!");
      } else {
        alert("Please enter a valid Gemini API key");
        elements.apiKeyInput.focus();
      }
    });
  }

  // AI Recipe Form
  const aiRecipeForm = document.getElementById("aiRecipeForm");
  if (aiRecipeForm) {
    aiRecipeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      generateRecipe();
    });
  }

  if (elements.generateRecipeBtn) {
    elements.generateRecipeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      generateRecipe();
    });
  }
  
  if (elements.saveAiRecipeBtn) {
    elements.saveAiRecipeBtn.addEventListener("click", saveAiRecipe);
  }

  // Login
  elements.loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = elements.loginName.value.trim();
    const email = elements.loginEmail.value.trim();

    if (!name || !email) {
      alert("Please fill in all fields.");
      return;
    }

    currentUser = {
      name,
      email,
      bio: "",
      createdAt: Date.now()
    };

    saveToStorage();
    updateUserDisplay();
    elements.loginModal.classList.add("hidden");
    showPage("home");
  });

  elements.closeLoginModal.addEventListener("click", () => {
    if (!currentUser) {
      alert("Please create an account to continue.");
      return;
    }
    elements.loginModal.classList.add("hidden");
  });

  elements.logoutBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to logout?")) {
      currentUser = null;
      localStorage.removeItem(STORAGE_KEYS.USER);
      elements.loginModal.classList.remove("hidden");
      showPage("home");
    }
  });

  // Initialize
  function init() {
    loadFromStorage();
    
    if (!currentUser) {
      elements.loginModal.classList.remove("hidden");
    } else {
      updateUserDisplay();
    }

    // Ensure sample data if empty
    if (recipes.length === 0) {
      recipes = [
        {
          id: uid(),
          title: "Classic Pancakes",
          mealType: "breakfast",
          difficulty: "easy",
          prepTime: 10,
          cookTime: 10,
          servings: 4,
          description: "Fluffy and delicious pancakes perfect for weekend mornings",
          ingredients: ["1½ cups flour", "1 tbsp sugar", "1 tsp baking powder", "1 egg", "1 cup milk", "2 tbsp butter"],
          instructions: "1. Mix dry ingredients in a bowl.\n2. In another bowl, whisk egg and milk.\n3. Combine wet and dry ingredients.\n4. Cook on a hot griddle until golden brown on both sides.\n5. Serve with maple syrup and butter.",
          image: null,
          calories: 250,
          protein: 8,
          carbs: 35,
          fat: 8,
          createdAt: Date.now()
        },
        {
          id: uid(),
          title: "Tomato Basil Pasta",
          mealType: "dinner",
          difficulty: "medium",
          prepTime: 10,
          cookTime: 15,
          servings: 4,
          description: "Fresh and simple pasta dish with cherry tomatoes and basil",
          ingredients: ["200g pasta", "2 cups cherry tomatoes", "handful fresh basil", "2 cloves garlic", "3 tbsp olive oil", "salt and pepper"],
          instructions: "1. Cook pasta according to package directions.\n2. Heat olive oil in a pan, add sliced garlic.\n3. Add halved cherry tomatoes and cook until soft.\n4. Toss cooked pasta with tomato mixture.\n5. Add fresh basil leaves and season with salt and pepper.\n6. Serve immediately.",
          image: null,
          calories: 320,
          protein: 12,
          carbs: 45,
          fat: 12,
          createdAt: Date.now()
        }
      ];
      saveToStorage();
    }

    renderRecipes();
    updateStats();
    showPage("home");
  }

  init();
})();
