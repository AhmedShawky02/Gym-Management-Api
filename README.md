
<img width="1637" height="819" alt="image" src="https://github.com/user-attachments/assets/84917da5-fcde-499e-a69c-88f6a5f2813a" />

## Gym Management System – Web Application

### **Overview**

A comprehensive Gym Management System designed to streamline the management of classes, supplements, bookings, and trainers, while providing a secure, scalable, and maintainable backend architecture.
The project follows a **Clean 3-Tier Architecture** (Controller / Service / Repository) to ensure separation of concerns, easier maintenance, and improved scalability.

This system implements **secure authentication**, **role-based access control**, **media uploads**, and strong **data validation**, making it a robust solution for managing a gym’s operations.

---

### **Key Features**

#### **Authentication & Authorization**

* Secure **JWT & Refresh Token** authentication.
* **Role-based access control** for:

  * **Admin**: Full system management.
  * **Trainer**: Availability management & review tracking.
  * **User**: Book classes, purchase supplements, leave reviews.

#### **Resource Management**

* **Trainers**: Availability scheduling & review viewing.
* **Packages**: Manage membership packages.
* **Supplements**: Full e-commerce-like supplement management with stock & quantity control.
* **Classes**: Booking & schedule management.
* **Gallery**: Direct uploads to **Cloudinary** with gallery display.
* **Support Tickets**: Pre-configured module ready for future release.

#### **E-Commerce Functionality**

* **Shopping Cart** for supplement purchases.
* Quantity & stock validation.
* Secure payment processing (integrated with Paymob API).

#### **Security & Performance**

* **Rate Limiting** to prevent abuse.
* Strong **request validation** using `express-validator`.
* Unified **error handling** for consistent API responses.

---

### **Technologies Used**

* **Backend**: Node.js, TypeScript, Express.js
* **Database**: PostgreSQL with Prisma ORM
* **Authentication**: JWT & Refresh Tokens
* **Media Storage**: Cloudinary
* **API Design**: REST
* **Other Tools**: WebSocket, API Rate Limiting, Validation Middleware

---

### **Architecture**

The project is organized into **three layers**:

1. **Controller Layer** – Handles incoming requests, validation, and response mapping.
2. **Service Layer** – Implements business logic and authorization checks.
3. **Repository Layer** – Interacts with the database using Prisma ORM.

---

### **Security Practices**

* Secrets and environment variables stored in `.env` (not committed to the repository).
* Role-based authorization for sensitive routes.
* Input validation for all endpoints.
* Proper error handling to avoid sensitive data leaks.

---

### **Outcome**

Delivered a **secure, scalable, and maintainable** gym management system with modular architecture, making it easy to extend and integrate new features.

---

📌 **Note:** This repository contains a **demo version** of the system for viewing purposes only. Sensitive configurations, production database schema, and API keys are **not included**.

