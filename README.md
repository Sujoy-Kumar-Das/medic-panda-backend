# 💊 Medic Panda – Online Pharmacy E-Commerce Application (server)

**Medic Panda** is a modern, scalable backend API for a single-vendor online pharmacy application. It empowers users to browse, purchase, and manage healthcare products seamlessly. Designed with performance, scalability, and security in mind, this backend is built using: **Typescript**, **Node**, **Express**, **Mongoose**, **zod** and **JWT**

---

## 🔗 Important Links

- 🔴 **Live Demo:** [Visit the frontend](https://medic-panda.vercel.app/)
- 🧩 **Frontend Code:** [Click Here](https://github.com/Sujoy-Kumar-Das/medic-panda-frontend)

---

## 🚀 Key Features

### ✅ Robust Authentication System

- User registration, login, JWT-based access & refresh tokens(with cookies)
- Secure email verification and,Reset Password system with OTP
- Role-based access control (Admin,Super-admin & Customer)

---

### 🛍️ Product Management

- Add, update, delete, and view products
- Supports product categories, manufacturers, stock, discounts, and reviews
- Automatically handle discounts status based on time

---

### 🔐 📦 Order & Cart System

- Cart operations, order placement, order history
- Inventory validation and secure transaction flow
- Handle order status by admin

---

### 🗣️ Review & Reply System

- Authenticated users can leave reviews and replies
- Moderation-ready structure for future enhancements

---

### 💳 Payment Integration

- Integrated with **SSLCommerz Payment Gateway**
- Real-time redirection and secure transaction handling
- Full sandbox and live mode support
- Order status updates based on payment results

---

### 🔐 Validation & Error Handling

- All routes validated with Zod
- Global error handler for consistent API responses

---

## 🛠️ Tech Stack

| Tool       | Purpose                         |
| ---------- | ------------------------------- |
| TypeScript | Strong typing and better dev UX |
| Express.js | Server framework                |
| Mongoose   | ODM for MongoDB                 |
| Zod        | Request/response validation     |
| JWT        | Authentication & Authorization  |
| dotenv     | Environment config              |
| bcrypt     | Password hashing                |

## 📁 Project Structure (Frontend)

---

## 📁 Project Structure (Frontend)

src/

├── app/

│ └── builder/

│ └── config/

│ └── DB/

│ └── emailTemplate/

│ └── errors/

│ └── helpers/

│ └── interface/

│ └── modules/

| └── admin/

| └── auth/

| └── blog/

| └── cart/

| └── category/

| └── customer/

| └── manufacturer/

| └── meta/

| └── orders/

| └── payment/

| └── productDetails/

| └── product/

| └── review-reply/

| └── reviews/

| └── user/

| └── wishList/

│ └── middlewares/

│ └── routes/

│ └── ssl/

│ └── utils/

├── app.ts

└── server.ts

---

## 🌐 Setup & Installation

### 1. Clone the repo

```bash
git clone https://github.com/Sujoy-Kumar-Das/medic-panda-backend
cd medic-panda-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create .env file

```bash
PORT=5000
db_url=YOUR_MONGODB_URL
saltRounds=10
jwt_access_token=YOUR_ACCESS_SECRET
jwt_refresh_token=YOUR_REFRESH_SECRET
otp_token=YOUR_OTP_SECRET
otp_verification_url=
node_env=development

# SSLCommerz
SSL_URL=https://sandbox.sslcommerz.com/gwprocess/v4/api.php
SSL_StoreID=YOUR_STORE_ID
SSL_PASSWORD=YOUR_STORE_PASSWORD

# Payment Callbacks
ssl_success_url=https://your-backend.com/api/v1/success-payment
ssl_failed_url=https://your-backend.com/api/v1/failed-payment
ssl_cancel_url=https://your-backend.com/api/v1/success-cancel

# Frontend Links
success_frontend_link=https://your-frontend.com/success-payment
failed_frontend_link=https://your-frontend.com/failed-payment
verify_email_frontend_link=https://your-frontend.com/verify-email
forgot_password_frontend_link=https://your-frontend.com/reset-password
email_verification_redirect_link=https://your-frontend.com/dashboard/security
base_frontend_link=https://your-frontend.com/

# Auth Email
auth_user_email=your@email.com
auth_user_password=YOUR_APP_PASSWORD

# Token Expiry
jwt_access_token_validation=5m
jwt_refresh_token_validation=30d

# Admin Setup
supper_admin_email=admin@email.com
supper_admin_password=YourAdminPassword123

```

### 4. Start Project

```bash
npm run dev
```

Visit the app at: http://localhost:5000

---

## 🙋‍♂️ Author

**Sujoy Kumar Das**

Frontend Developer | React Developer | MERN Stack Enthusiast

- GitHub: [@Sujoy-Kumar-Das](https://github.com/Sujoy-Kumar-Das)
- LinkedIn: [devsujoykumardas](https://dev-sujoy.vercel.app/)
- Portfolio: [portfolio](https://dev-sujoy.vercel.app/)
