# ConnectEvent 🎉

A full-stack Event Management Platform that enables users to create, discover, manage, and engage with events through a modern and interactive experience.

## 📖 Table of Contents

* [Features](#-features)
* [Tech Stack](#️-tech-stack)
* [Installation](#️-installation)
* [Environment Variables](#-environment-variables)
* [Running the Application](#️-running-the-application)
* [API Modules](#-api-modules)
* [Security Features](#-security-features)
* [Future Improvements](#-future-improvements)
* [Author](#-author)
* [License](#-license)

---

## 🚀 Features

### 👤 Authentication & Authorization

* User Registration and Login
* JWT-based Authentication
* Role-Based Access Control (Admin, Organizer, User)
* Protected Routes
* Secure Password Hashing with bcrypt

### 📅 Event Management

* Create Events
* Edit Events
* Delete Events
* View Event Details
* Event Dashboard
* Event Search & Discovery

### ❤️ User Engagement

* Like / Unlike Events
* Favorite Events
* Event Comments
* Follow / Unfollow Users
* Real-Time Notifications

### 📸 Media Management

* Upload Event Photos
* Cloudinary Integration
* Media Gallery
* Event Albums
* Personal Photo Collections

### 🤖 AI-Powered Features

* AI-Based Image Analysis
* Automated Media Tagging
* Face Recognition Integration
* Smart Photo Organization

### 🔔 Notification System

* Real-Time Event Notifications
* Like Notifications
* Comment Notifications
* Follow Notifications

### 🔎 Search System

* Search Events
* Search Users
* Filter and Discover Content

---

## 🏗️ Tech Stack

### Frontend

* React.js
* Vite
* React Router
* Axios
* Context API
* Socket.io Client

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Socket.io

### Cloud & AI Services

* Cloudinary
* Face++ API
* AI Image Processing Services

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/ARC-FROST/Connect_Event.git
cd Connect_Event
```

### 2. Install Backend Dependencies

```bash
cd BACKEND
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../FRONTEND
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `BACKEND` directory.

```env
PORT=2001

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

FACEPP_API_KEY=your_facepp_api_key
FACEPP_API_SECRET=your_facepp_api_secret
```

---

## ▶️ Running the Application

### Start Backend

```bash
cd BACKEND
npm run dev
```

Backend runs on:

```text
http://localhost:2001
```

### Start Frontend

```bash
cd FRONTEND
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## 📡 API Modules

### Authentication

* Register User
* Login User
* User Profile

### Events

* Create Event
* Update Event
* Delete Event
* Get Event Details

### Engagement

* Comments
* Likes
* Favorites
* Follow System

### Media

* Upload Media
* Event Albums
* Photo Gallery

### Notifications

* Real-Time Notifications
* Activity Tracking

---

## 🔒 Security Features

* JWT Authentication
* Password Hashing using bcrypt
* Protected API Routes
* Role-Based Access Control
* Environment Variable Management

---

## 🎯 Future Improvements

* Event Ticketing System
* QR Code Check-In
* Event Analytics Dashboard
* Event Recommendation Engine
* Chat & Messaging System
* Multi-Organization Support
* Mobile Application

---

## 👨‍💻 Author

**Ashish Kumar**

Built as a full-stack Event Management Platform integrating event management, social interaction, media sharing, AI-powered image processing, and real-time notifications.

---

## 📄 License

This project is intended for educational, learning, and portfolio purposes.
