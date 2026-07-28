# 📦 InvenTrack — Inventory Management System

A production-ready, full-stack Inventory Management System built with React, Node.js, Express, and MongoDB. Features a modern admin dashboard with dark mode, JWT authentication, product & category management, search, pagination, and Docker support.

---

## ✨ Features

### Core
- 🔐 **JWT Authentication** — Secure login with encrypted passwords
- 📊 **Dashboard** — Real-time overview with stats cards & low stock alerts
- 📦 **Product Management** — Full CRUD with image upload, search & pagination
- 🏷️ **Category Management** — Full CRUD with duplicate name prevention
- 🔍 **Smart Search** — Search products by name, SKU, or category
- ⚠️ **Low Stock Alerts** — Visual indicators for items below threshold (qty < 10)

### UI/UX
- 🌙 **Dark Mode** — Toggle between light and dark themes
- 📱 **Responsive Design** — Works on desktop, tablet, and mobile
- 🎨 **Premium Design** — Glass morphism, animations, gradients
- 🔔 **Toast Notifications** — Success/error feedback
- ⚡ **Loading States** — Smooth loading spinners
- 🗑️ **Confirmation Dialogs** — Prevent accidental deletions

### Technical
- 📚 **Swagger API Docs** — Auto-generated API documentation
- 🐳 **Docker Support** — Containerized deployment
- 🔒 **Security** — Helmet, CORS, input validation
- 📄 **Pagination** — Server-side pagination for products
- 🖼️ **Image Upload** — Product images via Multer

---

## 🛠 Tech Stack

| Layer       | Technology                                                    |
|-------------|---------------------------------------------------------------|
| **Frontend**| React 19, Vite, React Router v7, Tailwind CSS 3, Axios      |
| **Backend** | Node.js, Express 4, Mongoose 8, JWT, bcrypt                  |
| **Database**| MongoDB                                                       |
| **DevOps**  | Docker, Docker Compose, Nginx                                |
| **Docs**    | Swagger / OpenAPI 3.0                                        |

---

## 📁 Folder Structure

```
inventory-management/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── api/               # Axios instance
│   │   ├── components/        # Reusable UI components
│   │   │   └── ui/            # Button, Input, Card, Modal, Table, etc.
│   │   ├── context/           # AuthContext
│   │   ├── hooks/             # Custom hooks (useAuth)
│   │   ├── layouts/           # DashboardLayout
│   │   ├── pages/             # Login, Dashboard, Categories, Products, 404
│   │   ├── routes/            # AppRoutes
│   │   ├── services/          # API service modules
│   │   └── utils/             # Helpers, formatters, constants
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── server/                    # Node.js Backend
│   ├── config/                # DB connection, Swagger config
│   ├── controllers/           # Auth, Category, Product, Dashboard
│   ├── middleware/             # Auth, Error Handler, Validation, Upload
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API route definitions
│   ├── seed/                  # Admin user seeder
│   ├── services/              # Business logic
│   ├── utils/                 # Response helpers
│   ├── uploads/               # Product images
│   ├── Dockerfile
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MongoDB** (local or Atlas)
- **npm** v9+

### Backend Setup

```bash
cd inventory-management/server

# Install dependencies
npm install

# Create .env file (or copy from .env.example)
cp .env.example .env

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd inventory-management/client

# Install dependencies
npm install

# Create .env file (or copy from .env.example)
cp .env.example .env

# Start development server
npm run dev
```

---

## ⚙️ Environment Variables

### Backend (`server/.env`)

| Variable       | Default                                  | Description          |
|----------------|------------------------------------------|----------------------|
| `PORT`         | `5000`                                   | Server port          |
| `MONGO_URI`    | `mongodb://localhost:27017/inventory_db`  | MongoDB connection   |
| `JWT_SECRET`   | (required)                               | JWT signing secret   |
| `JWT_EXPIRES_IN` | `7d`                                   | Token expiration     |

### Frontend (`client/.env`)

| Variable       | Default                          | Description     |
|----------------|----------------------------------|-----------------|
| `VITE_API_URL` | `http://localhost:5000/api`      | Backend API URL |

---

## 🔑 Default Login Credentials

| Field    | Value           |
|----------|-----------------|
| Email    | `admin@test.com` |
| Password | `Admin@123`      |

> The default admin user is automatically created on first server start.

---

## 📚 API Documentation

Once the server is running, visit:

```
http://localhost:5000/api-docs
```

### Endpoints Summary

| Method | Endpoint                | Description           |
|--------|-------------------------|-----------------------|
| POST   | `/api/auth/login`       | Login                 |
| GET    | `/api/auth/me`          | Get current user      |
| GET    | `/api/categories`       | List categories       |
| POST   | `/api/categories`       | Create category       |
| PUT    | `/api/categories/:id`   | Update category       |
| DELETE | `/api/categories/:id`   | Delete category       |
| GET    | `/api/products`         | List products         |
| POST   | `/api/products`         | Create product        |
| PUT    | `/api/products/:id`     | Update product        |
| DELETE | `/api/products/:id`     | Delete product        |
| GET    | `/api/dashboard/stats`  | Dashboard statistics  |

---

## 🐳 Docker

```bash
# Build and start all services
docker-compose up --build

# Access the app
# Frontend: http://localhost
# Backend:  http://localhost:5000
# API Docs: http://localhost:5000/api-docs
```

---

## 📸 Screenshots

> Screenshots placeholder — add screenshots of the login page, dashboard, product list, and category management.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
