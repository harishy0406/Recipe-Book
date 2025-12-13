# 🍳 Recipe Master - Professional Recipe Management Platform

<div align="center">

![Recipe Master](https://img.shields.io/badge/Recipe-Master-orange?style=for-the-badge&logo=utensils)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)

**A modern, feature-rich recipe management platform with AI-powered recipe generation**

[Features](#-features) • [Screenshots](#-screenshots) • [Getting Started](#-getting-started) • [Usage](#-usage) • [Tech Stack](#-tech-stack)

</div>

---

## ✨ Features

### 🏠 Core Features
- ✅ **Recipe Management**: Create, edit, delete, and organize your favorite recipes
- 🔍 **Smart Search**: Search recipes by name, ingredients, or instructions
- 🏷️ **Category Filtering**: Filter by meal type (Breakfast, Lunch, Dinner, Dessert, Snack)
- ⭐ **Rating System**: Rate recipes from 1 to 5 stars
- ❤️ **Favorites**: Mark recipes as favorites for quick access
- 📊 **Statistics Dashboard**: View total recipes, favorites count, and average prep time
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### 🤖 AI-Powered Features
- 🧠 **AI Recipe Generation**: Generate professional recipes using Google Gemini AI
- 🎯 **Customizable Generation**: Set meal type and difficulty level
- 💾 **One-Click Save**: Save AI-generated recipes directly to your recipe book
- 🔐 **Secure API Key Storage**: API keys stored locally, never shared

### 👤 User Features
- 🔐 **User Authentication**: Create and manage your account
- 📝 **Profile Management**: Edit your name, email, and bio
- 📜 **View History**: Track which recipes you've viewed
- ⭐ **Favorites Collection**: Quick access to your favorite recipes
- ⚙️ **Settings**: Customize app preferences
- 💾 **Data Export/Import**: Backup and restore your recipes

### 🎨 UI/UX Features
- 🌙 **Modern Dark Theme**: Beautiful gradient-based dark theme
- 🎭 **Smooth Animations**: Polished transitions and hover effects
- 🖼️ **Image Support**: Add images to your recipes
- 📋 **Nutritional Info**: Track calories, protein, carbs, and fat
- ⏱️ **Prep & Cook Times**: Detailed timing information
- 👥 **Serving Sizes**: Specify number of servings

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A Google Gemini API key (for AI features) - [Get one here](https://makersuite.google.com/app/apikey)

### Installation

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/yourusername/recipe-book.git
   cd recipe-book
   ```

2. **Open the project**
   - Simply open `index.html` in your web browser
   - Or use a local server (recommended):
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js (http-server)
     npx http-server
     
     # Using PHP
     php -S localhost:8000
     ```

3. **Access the application**
   - Open your browser and navigate to `http://localhost:8000`
   - Or double-click `index.html` to open directly

---

## 📖 Usage

### First Time Setup

1. **Create Your Account**
   - On first visit, you'll be prompted to create an account
   - Enter your name and email address
   - Click "Get Started"

2. **Configure AI Mode (Optional)**
   - Navigate to the **AI Mode** page
   - Enter your Google Gemini API key
   - Click "Save API Key"

### Adding Recipes

#### Manual Entry
1. Click the **"+ Add Recipe"** button
2. Fill in the recipe details:
   - Title (required)
   - Meal type
   - Difficulty level
   - Prep and cook times
   - Servings
   - Ingredients (add one by one)
   - Instructions (required)
   - Description (optional)
   - Nutritional info (optional)
   - Image (optional)
3. Click **"Save Recipe"**

#### AI Generation
1. Go to the **AI Mode** page
2. Enter a recipe description (e.g., "A quick and easy chocolate chip cookie recipe")
3. Select meal type and difficulty
4. Click **"Generate Recipe"**
5. Review the generated recipe
6. Click **"Save to Recipe Book"** to add it

### Managing Recipes

- **View Recipe**: Click on any recipe card to see full details
- **Edit Recipe**: Open recipe details and click "Edit"
- **Delete Recipe**: Open recipe details and click "Delete"
- **Rate Recipe**: Open recipe details and select a rating
- **Favorite Recipe**: Click the heart icon on any recipe card

### Profile Management

1. Navigate to **Profile** page
2. **Account Tab**: Edit your personal information
3. **History Tab**: View your recipe viewing history
4. **Favorites Tab**: See all your favorite recipes
5. **Settings Tab**: Configure app settings and export/import data

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Icons**: Font Awesome 6.4.0
- **AI Integration**: Google Gemini API
- **Storage**: Browser LocalStorage
- **No Backend Required**: Fully client-side application

---

## 📁 Project Structure

```
recipe-book/
│
├── index.html          # Main HTML file
├── app.js              # JavaScript application logic
├── styles.css          # Styling and themes
├── README.md          # This file
│
└── screenshots/       # (Create this folder for screenshots)
    ├── home-page.png
    ├── ai-mode.png
    ├── profile.png
    └── ...
```

---

## 🎯 Key Features Explained

### 🔐 Local Storage
All data (recipes, user info, settings) is stored locally in your browser using LocalStorage. No server required, no data sent to external servers (except AI API calls).

### 🤖 AI Recipe Generation
Powered by Google Gemini AI, you can generate professional recipes from simple descriptions. The AI creates:
- Complete ingredient lists
- Step-by-step instructions
- Nutritional information
- Appropriate prep and cook times

### 📊 Statistics
Track your recipe collection with real-time statistics:
- Total number of recipes
- Number of favorites
- Average preparation time

---

## 🔒 Privacy & Security

- ✅ All data stored locally in your browser
- ✅ API keys stored securely in LocalStorage
- ✅ No data sent to external servers (except AI API calls)
- ✅ No tracking or analytics
- ✅ Export your data anytime

---

## 🚧 Future Enhancements

Potential features for future versions:
- [ ] Recipe sharing via URL
- [ ] Meal planning calendar
- [ ] Shopping list generation
- [ ] Recipe scaling (adjust servings)
- [ ] Print-friendly recipe view
- [ ] Recipe collections/categories
- [ ] Social features (share recipes)
- [ ] Recipe import from popular sites

---

## 📸 Screenshots

<!-- 
TODO: Add screenshots here
- Screenshot 1: Home page with recipe cards
- Screenshot 2: AI Mode page
- Screenshot 3: User Profile page
- Screenshot 4: Recipe detail view
- Screenshot 5: Recipe creation form

Example format:
![Home Page](screenshots/home-page.png)
![AI Mode](screenshots/ai-mode.png)
![Profile](screenshots/profile.png)
![Recipe Detail](screenshots/recipe-detail.png)
![Create Recipe](screenshots/create-recipe.png)
-->

## 🤝 Contributing

Contributions are welcome! Feel free to:
- 🐛 Report bugs
- 💡 Suggest new features
- 🔧 Submit pull requests
- 📝 Improve documentation

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

Created with ❤️ for food lovers and cooking enthusiasts.

---

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for AI recipe generation
- [Font Awesome](https://fontawesome.com/) for beautiful icons
- All the amazing developers in the open-source community

---

<div align="center">

**Made with ❤️ and lots of ☕**

⭐ Star this repo if you find it helpful!

</div>
