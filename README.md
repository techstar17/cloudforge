# ☁️ CloudForge

CloudForge is a full-stack cloud file upload system built with **Node.js, Express, React, JWT authentication, and AWS S3**.  
It allows users to securely register, login, and upload files to cloud storage.

---

## 🚀 Live Features

- 🔐 User Registration & Login (JWT Auth)
- ☁️ Secure AWS S3 File Upload
- 📦 Protected API Routes
- ⚡ React Frontend UI
- 🛡️ Password Hashing (bcrypt)
- 🔑 Token-based Authentication

---

## 🏗️ Tech Stack

### Frontend
- React
- JavaScript

### Backend
- Node.js
- Express.js
- JWT (Authentication)
- bcryptjs
- Multer

### Cloud
- Amazon S3 (AWS)

---

## 📸 Project Preview

### Login Page
![Login](./screenshots/login.png)

### Upload Page
![Upload](./screenshots/upload.png)

### Success Upload
![Success](./screenshots/success.png)

---

## ⚙️ How It Works

1. User registers or logs in
2. Server generates JWT token
3. User selects a file
4. File is sent to backend
5. Backend uploads file to AWS S3
6. Returns public file URL

---

## 📂 Project Structure
