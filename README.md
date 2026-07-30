# BCT Project - Full-Stack Todo Application

This repository contains the source code for a full-stack Todo application, featuring a modern frontend built with Angular and a robust backend API powered by Node.js, Express, and MongoDB.

## 📂 Project Structure

The project is structured as a monorepo with two main directories:

- **[`/todo`](./todo)**: The frontend application built with Angular. It provides a responsive and modern user interface for managing tasks.
- **[`/backend`](./backend)**: The backend REST API built with Node.js, Express, and MongoDB to handle data storage, user authentication, and business logic.

## 🚀 Technologies Used

### Frontend
- Angular
- TypeScript
- HTML5 / CSS3

### Backend
- Node.js
- Express.js
- MongoDB (via Mongoose)
- JSON Web Tokens (JWT) for authentication
- bcryptjs for password hashing

## 🛠️ Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) database (MongoDB Atlas or local)

### 1. Backend Setup (Node.js API)

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory with the following variables (replace with your own values):
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *(The server will start on `http://localhost:5000`)*

### 2. Frontend Setup (Angular)

1. Open a new terminal and navigate to the `todo` directory:
   ```bash
   cd todo
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend application:
   ```bash
   npm start
   ```
4. Open your browser and navigate to `http://localhost:4200/`.

## 🔒 Features
- **User Authentication:** Secure Signup and Login.
- **JWT Authorization:** Protected API routes.
- **Task Management:** Create, Read, Update, and Delete (CRUD) tasks.
- **Responsive UI:** A modern interface built with Angular.

## 📝 License

This project is licensed under the MIT License.
