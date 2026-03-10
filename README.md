# Milk Delivery Platform

A **full-stack milk delivery web application** built using **React (Vite)** for the frontend and **Django + Django REST Framework** for the backend.

The platform supports **two roles**:

* **Admin** – manages products, plans, staff, and customers.
* **Customer** – browses milk products, subscribes to plans, and places orders.

---

# Tech Stack

## Frontend

* React (Vite)
* React Router
* LocalStorage (for session state)

## Backend

* Django
* Django REST Framework (DRF)
* SQLite database

---

# Project Structure

```
project-root/
│
├── frontend/        # React frontend (Vite)
│
├── milkman/         # Django backend
│   ├── customers/
│   ├── subscriptions/
│   ├── orders/
│   ├── products/
│   └── staff/
│
└── README.md
```

---

# Roles

## Admin

Admin has access to management features.

Capabilities:

* Manage Products
* Manage Staff
* View Customers
* Manage Subscription Plans

Admin credentials are currently **hardcoded**:

```
email: harshshinde@gmail.com
password: password
```

---

## Customer

Customers can:

* Create an account
* Browse milk products
* Add products to cart
* Subscribe to milk plans
* Checkout orders
* View order history
* Manage their profile

---

# Authentication

Authentication is implemented with a **simple custom approach**.

### Login Flow

The login API checks:

1. **Hardcoded admin credentials**
2. **Customer records stored in the database**

### Frontend Session State

The frontend stores only minimal session data:

```
localStorage:
  role
  username
```

No business data is stored in localStorage.

---

# Landing Page

The landing page serves as the **main entry point**.

Navigation changes based on user role.

### Logged Out

* Home
* Plans
* Login
* Signup
* Hero "Subscribe Now" button visible

### Customer

* Shop
* Plans
* My Account

### Admin

* Plans
* Staff
* Products
* Customers

---

# Customer Features

## Signup

Customers register with:

* Username
* Email
* Address
* Mobile number
* Password

---

## Shop

Features:

* Product listing from backend
* Search
* Filtering
* Sorting
* Cart management

Cart actions:

* Add item
* Remove item
* Increment quantity
* Decrement quantity

---

## Checkout

Displays:

* Cart items
* Subtotal
* Delivery charge
* Total bill

Customer confirms payment to place order.

---

## Order Summary

Shows:

* Username
* Order number
* Order date
* Ordered items
* Total bill

---

## My Account

Tabbed interface with:

### Subscription

Shows current subscription plan.

### Orders

Displays customer order history.

### Profile

Displays basic user information.

---

# Admin Features

## Product Management

Admin can:

* Add products
* View products
* Update products
* Delete products

---

## Staff Management

Admin can:

* View staff members
* Add new staff

---

## Customer Management

Admin can view:

* Username
* Email
* Mobile number
* Address
* Subscription plan
* Subscription status
* Subscription date

---

## Plan Management

Plans are managed directly from the **Landing Page Plans section**.

Admin can:

* Add a plan
* Delete a plan

Plan fields:

* Plan name
* Monthly price
* Quantity

---

# Backend Data Models

## Customer

`customers.Customer`

Fields:

```
username
email
mobile
address
password
role
created_at
```

---

## Plan

`subscriptions.Plan`

Fields:

```
name
monthly_price
quantity
created_at
```

---

## Customer Subscription

`subscriptions.CustomerSubscription`

Fields:

```
customer (OneToOne)
plan
status
subscribed_at
```

---

## Customer Order

`orders.CustomerOrder`

Fields:

```
customer_username
order_number
total_bill
order_date
items (JSON)
created_at
```

---

# API Endpoints

## Customers

```
GET    /api/customers/
POST   /api/customers/
POST   /api/customers/login/
```

---

## Plans

```
GET    /api/plans/
POST   /api/plans/
DELETE /api/plans/<id>/
```

---

## Subscriptions

```
GET    /api/subscriptions/
GET    /api/subscriptions/<username>/
POST   /api/subscriptions/<username>/
```

---

## Customer Orders

```
POST   /api/customer-orders/
GET    /api/customer-orders/<username>/
```

---

## Existing APIs

```
GET/POST /api/products/
GET/POST /api/staff/
GET/POST /api/orders/
```

---

# Data Storage

All **business data is stored in SQLite via Django models**.

Stored in database:

* Customers
* Plans
* Subscriptions
* Orders
* Products
* Staff

Stored in **localStorage only**:

```
role
username
```

---

# Running the Project

## Backend Setup

Navigate to backend directory:

```
cd milkman
```

Install dependencies:

```
pip install -r requirements.txt
```

Run migrations:

```
python manage.py makemigrations
python manage.py migrate
```

Start the backend server:

```
python manage.py runserver
```

Backend runs on:

```
http://127.0.0.1:8000
```

---

## Frontend Setup

Navigate to frontend folder:

```
cd frontend
```

Install dependencies:

```
npm install
```

Start development server:

```
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# Important Notes

### Database Migration

Schema updates require manual migration:

```
python manage.py makemigrations
python manage.py migrate
```

---

# Known Limitations

Current implementation has some intentional simplifications.

### Security

* Passwords stored in **plain text**
* No hashing yet

### Authentication

* Not using Django Auth
* No JWT or session authentication

### Admin Account

Admin user is **hardcoded**.

### APIs

* No pagination
* No advanced search
* Limited error handling

---

# Future Improvements

Recommended improvements for production readiness:

* Password hashing using Django authentication
* JWT based aut
