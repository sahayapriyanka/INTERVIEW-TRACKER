# 🎯 InterviewOS — Smart Interview Preparation Tracker

A full-stack MERN application to track your job applications, interview rounds, HR feedback, and analytics.

## 🚀 Tech Stack

| Layer     | Tech                          |
|-----------|-------------------------------|
| Frontend  | React + Vite                  |
| Backend   | Node.js + Express             |
| Database  | MongoDB + Mongoose            |
| Auth      | JWT + bcryptjs                |
| Styling   | Inline CSS (dark theme)       |

---

## 📁 Project Structure

```
interview-tracker/
├── client/               # React frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   └── pages/
│   │       ├── Login.jsx
│   │       ├── Dashboard.jsx
│   │       ├── ApplicationList.jsx
│   │       └── ApplicationDetail.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/               # Express backend
│   ├── models/
│   │   ├── User.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── applications.js
│   ├── middleware/
│   │   └── auth.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── applicationController.js
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/interview-tracker.git
cd interview-tracker
```

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Fill in your MongoDB URI and JWT secret in .env
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

---

## 🔑 Environment Variables (`server/.env`)

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/interview-tracker
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint           | Description       |
|--------|--------------------|-------------------|
| POST   | /api/auth/register | Register new user |
| POST   | /api/auth/login    | Login & get token |
| GET    | /api/auth/me       | Get current user  |

### Applications
| Method | Endpoint              | Description             |
|--------|-----------------------|-------------------------|
| GET    | /api/applications     | Get all applications    |
| POST   | /api/applications     | Create new application  |
| GET    | /api/applications/:id | Get single application  |
| PUT    | /api/applications/:id | Update application      |
| DELETE | /api/applications/:id | Delete application      |
| GET    | /api/applications/analytics | Get analytics    |

---

## ✨ Features

- 🔐 JWT Authentication (Register / Login / Protected routes)
- 📋 Full CRUD for job applications
- 🎯 Track stages: Applied → HR Round → Technical → Final Round → Offer / Rejected
- 📝 Store HR feedback notes & rejection reasons
- 📊 Analytics dashboard (success rate, pipeline chart)
- 🔍 Search & filter by stage

---

## 🌐 Deployment

- **Frontend**: Vercel / Netlify
- **Backend**: Railway / Render / Heroku
- **Database**: MongoDB Atlas

---

## 📄 License

MIT
