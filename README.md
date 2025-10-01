# 💰 Finance Tracker

A full-stack personal finance management application built with React, Node.js, Express, and MongoDB. Track your income and expenses, visualize spending patterns, and manage your financial health with ease.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)

## ✨ Features

### 💳 Transaction Management
- ✅ Add, edit, and delete income/expense transactions
- ✅ Categorize transactions (Salary, Food, Transport, Entertainment, etc.)
- ✅ Search and filter transactions by type, category, date range
- ✅ Pagination for large transaction lists
- ✅ Real-time transaction updates

### 📊 Analytics & Insights
- ✅ Financial summary dashboard (total income, expenses, balance)
- ✅ Category-wise spending breakdown (pie chart)
- ✅ Monthly spending trends (line chart)
- ✅ Recent activity feed
- ✅ Visual data representation with Chart.js

### 👤 User Management
- ✅ User registration and authentication (JWT)
- ✅ Secure login with access/refresh tokens
- ✅ Profile management (update name, email, currency preference)
- ✅ Profile image upload with Cloudinary
- ✅ Password change functionality

### 🔒 Security Features
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Rate limiting on API endpoints
- ✅ Protected routes and API endpoints
- ✅ Token refresh mechanism

### 📝 Logging & Monitoring
- ✅ Winston logger for comprehensive logging
- ✅ HTTP request logging with Morgan
- ✅ Error tracking and debugging
- ✅ User activity logging
- ✅ Daily log rotation and compression

### 🎨 UI/UX
- ✅ Modern, responsive Material-UI design
- ✅ Mobile-friendly interface
- ✅ Loading states and error handling

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Redux Toolkit** - State management
- **RTK Query** - Data fetching and caching
- **Material-UI (MUI)** - Component library
- **React Router v6** - Routing
- **Chart.js & react-chartjs-2** - Data visualization
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Winston** - Logging
- **Morgan** - HTTP logging
- **Multer** - File upload handling
- **Cloudinary** - Image storage
- **express-rate-limit** - API rate limiting

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (v8 or higher) - Comes with Node.js
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/downloads)

Optional:
- **MongoDB Compass** - GUI for MongoDB
- **Postman** - API testing

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/finance_tracker.git
cd finance_tracker
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Set Up Environment Variables

#### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=3001

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/finance_tracker

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_ACCESS_EXPIRES_IN=60m
JWT_REFRESH_EXPIRES_IN=1d

# Cloudinary Configuration (for profile image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Logging Configuration
LOG_LEVEL=info
ENABLE_FILE_LOGGING=false
```

**Get Cloudinary Credentials:**
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret

#### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```bash
cd ../frontend
cp .env.example .env
```

Edit the `.env` file:

```env
VITE_API_URL=http://localhost:3001/api
```

### 5. Start MongoDB

Make sure MongoDB is running on your system:

**macOS (using Homebrew):**
```bash
brew services start mongodb-community
```

**Windows:**
```bash
net start MongoDB
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Or use MongoDB Atlas (Cloud):**
- Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas)
- Create a cluster
- Get connection string
- Update `MONGODB_URI` in backend `.env`

## 🏃 Running the Application

### Option 1: Run Backend and Frontend Separately

#### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:3001`

You should see:
```
Server running on port 3001
Environment: development
MongoDB Connected: localhost
```

#### Start Frontend Development Server

Open a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

## 🌐 Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

**Happy Tracking! 💰📊**
