# Quiz Application

A full-stack quiz application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and styled with Tailwind CSS. The app allows users to register, login, take quizzes, and view their scores with a clean and responsive UI.

---

## 🚀 Live Demo

Try the app live here:  
[https://quiz-application-frontend-1.onrender.com/login](https://quiz-application-frontend-1.onrender.com)

---

## 📋 Features

- User registration and authentication with JWT
- Create and take quizzes
- Responsive and modern UI powered by Tailwind CSS
- View quiz results and performance tracking
- Separate backend and frontend for scalability

---

## 🛠 Technology Stack

| Layer     | Technology                  |
|-----------|-----------------------------|
| Frontend  | React.js, Tailwind CSS, Axios, React Router |
| Backend   | Node.js, Express.js         |
| Database  | MongoDB (via Mongoose ODM)  |
| Authentication | JWT (JSON Web Tokens)   |

---

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v14 or higher recommended)
- MongoDB (local or Atlas)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend folder:

   ```bash
   cd backend

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` folder with the following variables:

   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start the backend server:

   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend folder:

   ```bash
   cd ../frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the React development server:

   ```bash
   npm start
   ```

The frontend runs by default on [http://localhost:3000](http://localhost:3000) and will interact with the backend API on port 5000.

---

## 📖 Usage

* Register a new account or login with existing credentials.
* Browse available quizzes.
* Attempt quizzes and submit answers.
* View quiz scores and history.

---

## 🔗 API Endpoints Overview

| Method | Endpoint             | Description                    |
| ------ | -------------------- | ------------------------------ |
| POST   | `/api/auth/register` | Register a new user            |
| POST   | `/api/auth/login`    | User login                     |
| GET    | `/api/quizzes`       | Get list of quizzes            |
| POST   | `/api/quizzes`       | Create a new quiz (admin only) |
| PUT    | `/api/quizzes/:id`   | Update a quiz (admin only)     |
| DELETE | `/api/quizzes/:id`   | Delete a quiz (admin only)     |

*Note: Authentication tokens (JWT) are required for protected routes.*

---

## 🧪 Testing

Currently, there are no automated tests configured. Future versions will include tests using Jest and React Testing Library.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/Popie52/Quiz_Application/issues).

### How to contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

* [MongoDB](https://www.mongodb.com/)
* [Express.js](https://expressjs.com/)
* [React.js](https://reactjs.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Node.js](https://nodejs.org/)

---

If you have any questions or feedback, feel free to open an issue or contact me.

---

**Happy Quizzing! 🎉**


---
