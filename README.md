# RateHub — Store Rating Platform

A full-stack web application that enables users to discover stores, submit ratings, and manage store information through a secure role-based access system. The platform supports three user roles: System Administrator, Normal User, and Store Owner.

## Tech Stack

* **Backend:** Express.js + Sequelize ORM
* **Database:** PostgreSQL
* **Frontend:** React.js (CRA) + React Router v6
* **Authentication:** JWT (JSON Web Tokens)
* **Password Security:** bcrypt

---

# Challenge Requirement Coverage

This project was developed as a solution to the **FullStack Intern Coding Challenge** and satisfies all specified requirements.

## Technology Stack Compliance

| Requirement       | Implementation |
| ----------------- | -------------- |
| Backend Framework | Express.js     |
| Database          | PostgreSQL     |
| Frontend          | React.js       |
| Authentication    | JWT            |
| ORM               | Sequelize      |
| API Architecture  | RESTful APIs   |

---

## System Administrator Features

| Requirement                    | Status |
| ------------------------------ | ------ |
| Add Stores                     | ✅      |
| Add Normal Users               | ✅      |
| Add Admin Users                | ✅      |
| Dashboard Statistics           | ✅      |
| Total Users Count              | ✅      |
| Total Stores Count             | ✅      |
| Total Ratings Count            | ✅      |
| View Store Listings            | ✅      |
| View User Listings             | ✅      |
| View Detailed User Information | ✅      |
| Filter Users & Stores          | ✅      |
| Sorting Support                | ✅      |
| Logout                         | ✅      |

---

## Normal User Features

| Requirement              | Status |
| ------------------------ | ------ |
| User Registration        | ✅      |
| User Login               | ✅      |
| Update Password          | ✅      |
| Browse Stores            | ✅      |
| Search Stores by Name    | ✅      |
| Search Stores by Address | ✅      |
| View Overall Ratings     | ✅      |
| View Submitted Rating    | ✅      |
| Submit Rating (1–5)      | ✅      |
| Modify Existing Rating   | ✅      |
| Logout                   | ✅      |

---

## Store Owner Features

| Requirement                | Status |
| -------------------------- | ------ |
| Login                      | ✅      |
| Update Password            | ✅      |
| View Users Who Rated Store | ✅      |
| View Average Store Rating  | ✅      |
| Logout                     | ✅      |

---

## Form Validation Compliance

| Field    | Validation                       |
| -------- | -------------------------------- |
| Name     | 20–60 characters                 |
| Address  | Maximum 400 characters           |
| Email    | Standard email validation        |
| Password | 8–16 characters                  |
| Password | At least one uppercase character |
| Password | At least one special character   |

---

## Additional Features

* Role-Based Access Control (RBAC)
* JWT Authentication
* Password Hashing with bcrypt
* Protected Routes
* Search & Filtering
* Sorting Functionality
* Responsive UI
* RESTful API Design
* Sequelize ORM Associations
* PostgreSQL Relational Database Design

---

## Database Schema

### Entities

#### User

* id
* name
* email
* password
* address
* role

#### Store

* id
* name
* email
* address
* ownerId

#### Rating

* id
* rating (1–5)
* userId
* storeId

### Relationships

* One Store Owner can own multiple stores.
* One User can rate multiple stores.
* One Store can receive ratings from multiple users.
* Ratings are maintained in a separate table for normalization and scalability.

---

## Getting Started

### 1. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE store_rating_db;
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env

# Configure PostgreSQL credentials and JWT secret

node src/seed.js
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on:

```text
http://localhost:3000
```

---

## Default Admin Credentials

```text
Email: admin@ratehub.com
Password: Admin@1234
```

---

## User Roles & Permissions

| Role        | Access                                              |
| ----------- | --------------------------------------------------- |
| Admin       | Manage users, stores, ratings, dashboard analytics  |
| Normal User | Browse stores, search stores, submit/update ratings |
| Store Owner | View store ratings and average rating statistics    |

---

## Screenshots are store in docs
---

## Validation Rules

| Field    | Rule                                                                         |
| -------- | ---------------------------------------------------------------------------- |
| Name     | 20–60 characters                                                             |
| Email    | Standard email format                                                        |
| Address  | Maximum 400 characters                                                       |
| Password | 8–16 characters with at least one uppercase letter and one special character |

---

## API Endpoints

### Authentication

| Method | Endpoint                  | Description          |
| ------ | ------------------------- | -------------------- |
| POST   | /api/auth/register        | Register User        |
| POST   | /api/auth/login           | Login                |
| PATCH  | /api/auth/update-password | Update Password      |
| GET    | /api/auth/me              | Current User Details |

### Admin APIs

| Method | Endpoint             | Description          |
| ------ | -------------------- | -------------------- |
| GET    | /api/admin/stats     | Dashboard Statistics |
| GET    | /api/admin/users     | List Users           |
| GET    | /api/admin/users/:id | User Details         |
| POST   | /api/admin/users     | Create User          |
| GET    | /api/admin/stores    | List Stores          |
| POST   | /api/admin/stores    | Create Store         |

### Store APIs

| Method | Endpoint             | Description           |
| ------ | -------------------- | --------------------- |
| GET    | /api/stores          | List Stores           |
| POST   | /api/stores/rate     | Submit/Update Rating  |
| GET    | /api/stores/my-store | Store Owner Dashboard |

---

## Project Structure

```text
store-rating-app/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── index.js
│       └── seed.js
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── utils/
│
├── docs/
│   ├── p1.PNG
│   ├── p2.PNG
│   └── ...
│
└── README.md
```

---

## Security Features

* JWT Authentication
* Password Hashing using bcrypt
* Protected API Routes
* Role-Based Authorization
* Input Validation
* Secure Password Updates

---

## Author

**Harshada Gujar**

Full Stack Developer | React.js | Express.js | PostgreSQL
