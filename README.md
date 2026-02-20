# RateHub - Store Rating Platform

RateHub is a full-stack web application that allows users to submit and manage ratings for stores registered on the platform. It features a robust role-based access control system with dedicated dashboards for System Administrators, Normal Users, and Store Owners.

## 🚀 Tech Stack

- **Frontend**: React (Vite), Vanilla CSS, Lucide-React icons.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Authentication**: JWT (JSON Web Tokens) with Role-Based Access Control.

## 📁 Folder Structure

```text
RateHub/
├── client/                # React Frontend
│   ├── src/
│   │   ├── api/           # API service (Axios)
│   │   ├── components/    # Shared components (Layout, ProtectedRoute)
│   │   ├── context/       # Auth context state
│   │   ├── pages/         # Dashboard & Auth pages
│   │   └── index.css      # Design System
├── server/                # Express Backend
│   ├── config/            # Database connection
│   ├── controllers/       # Business logic (Auth, Store, User)
│   ├── middleware/        # JWT & Role validation
│   ├── models/            # Mongoose schemas (User, Store, Rating)
│   ├── routes/            # API endpoints
│   ├── index.js           # Server entry point
│   └── seed.js            # Initial admin seeding script
```

## 🛠️ Setup Instructions

### 1. Prerequisites
- Node.js installed.
- MongoDB instance running (Local or Atlas).

### 2. Backend Setup
1. Open a terminal in the `server` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your Environment Variables:
   - Create/check the `.env` file in the `server` root:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```
4. **Seed Initial Admin Account**:
   Run this once to create the first admin user:
   ```bash
   node seed.js
   ```
   - **Admin Email**: `admin@ratehub.com`
   - **Admin Password**: `AdminPassword123!`

5. Start the server:
   ```bash
   npm start
   ```

### 3. Frontend Setup
1. Open a terminal in the `client` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Access the app at `http://localhost:5173`.

---

## 👥 User Roles & Access

### 1. System Administrator
- **Capabilities**: Add new stores, manage all users (Normal, Admin, Store Owner).
- **Dashboard**: Total stats (Users, Stores, Ratings) + Searchable/Sortable tables.
- **Store Setup**: Must create a user with the **"Store Owner"** role before a store can be registered to their email.

### 2. Normal User
- **Capabilities**: Sign up via Registration page, login, view all stores.
- **Interaction**: Search for stores by Name/Address, submit ratings (1-5), and modify their existing ratings.

### 3. Store Owner
- **Capabilities**: Login, view analytics for their specific store.
- **Dashboard**: Average rating of their store + detailed list of users who submitted ratings.

---

## 📝 Form Validations

The system enforces strict rules for data integrity:
- **Name**: 20 - 60 characters.
- **Address**: Maximum 400 characters.
- **Password**: 8 - 16 characters (must include one **uppercase letter** and one **special character**).
- **Email**: Standard email format validation.
- **Ratings**: Integer between 1 and 5.

## 🎯 How to Use (Step-by-Step)

1. **Login as Admin** using the seeded credentials.
2. **Setup your environment**: 
   - Create a **Store Owner** user in "User Management".
   - Create a **Store** in "Store Management" using that owner's email.
3. **Register a User**: Sign up a new "Normal User" from the registration page.
4. **Submit Ratings**: Log in as the Normal User, find the store, and click on the stars to rate.
5. **View Results**: Log in as the Store Owner to see your store's performance.

---
*Built with ❤️ for RateHub*
