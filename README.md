# Cucinare API 🍳 - Backend Documentation

This is the backend API for the Cucinare recipe-sharing platform, built using **Node.js**, **Express**, and **MongoDB (via Mongoose)**.

---

## 🛠️ Security Features & Middleware

The backend incorporates advanced security layers to prevent exploits:
- **CORS Configuration**: Restricted origin checks allowing only authorized frontend domains (`http://localhost:3000` / `http://localhost:5001`).
- **IP Rate Limiting (`express-rate-limit`)**: Limits requests from the same IP to prevent brute-force and DDoS attacks (whitelisted up to 10,000 requests per window).
- **Data Sanitization (`express-mongo-sanitize`)**: Strips out MongoDB operators (e.g., query injections like `$` and `.`) from user inputs.
- **XSS Prevention (`xss-clean`)**: Sanitizes user inputs from harmful HTML/Javascript code insertion.
- **HTTP Parameter Pollution Prevention (`hpp`)**: Prevents parameter duplication attacks, whitelisting valid filter properties:
  `['category', 'difficulty', 'time', 'rating', 'reviews', 'creator']`

---

## 📂 Backend Architecture

- **`server.js`**: Database connection initialization and listening server configuration.
- **`app.js`**: Express application configuration, registering global security middlewares, and route management.
- **`models/`**: Schema structures validation and definitions for MongoDB.
- **`controllers/`**: API business logic handlers including factory pattern functions (`handlerFactory.js`) for CRUD operations.
- **`routes/`**: Endpoint definitions separating user, category, and recipe layers.
- **`middleware/`**: Auth guards, role verification, and global error middleware.

---

## 🔌 API Endpoints Summary

### 👤 User Endpoints (`/api/v1/users`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| **POST** | `/signup` | Public | Register a new user account |
| **POST** | `/login` | Public | Login user and issue JWT token |
| **POST** | `/forgotPassword` | Public | Send recovery token to email |
| **PATCH** | `/resetPassword/:token` | Public | Reset password using email token |
| **GET** | `/me` | User / Admin | Get current logged-in user profile details |
| **PATCH** | `/updateMe` | User / Admin | Update name and email fields |
| **PATCH** | `/updateMyPassword` | User / Admin | Change password securely |
| **DELETE** | `/deleteMe` | User / Admin | Deactivate current user account |

### 📖 Recipe Endpoints (`/api/v1/recipes`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| **GET** | `/` | Public | List all recipes (supports query filtering & pagination) |
| **GET** | `/:id` | Public | View a specific recipe by ID |
| **POST** | `/` | Authenticated | Create a new recipe (auto-assigns creator ID) |
| **DELETE** | `/deleteMyRecipe/:id` | Creator | Delete a recipe created by the current user |
| **DELETE** | `/:id` | Admin Only | Delete *any* recipe inside the system |

### 🏷️ Category Endpoints (`/api/v1/categories`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| **GET** | `/` | Public | Get list of all recipe categories |
| **POST** | `/` | Admin Only | Create a new category |
| **GET** | `/:categoryName/recipes` | Public | Retrieve all recipes belonging to a specific category |

---

## ⚙️ Environment Variables Config

Create a `config.env` file in the root backend folder:

```env
NODE_ENV=development
PORT=5001
DATABASE_LOCAL=mongodb://localhost:27017/cucinare
JWT_SECRET=your-secure-jwt-signing-key
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# SMTP Details (For Password recovery emails)
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USERNAME=your-mailtrap-username
EMAIL_PASSWORD=your-mailtrap-password
```

---

## 💻 Running the Backend

Install requirements:
```bash
npm install
```

Start Development:
```bash
npm run dev
```

Start Production:
```bash
npm run prod
```
