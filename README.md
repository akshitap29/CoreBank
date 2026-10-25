# CoreBank — Full-Stack Banking Simulation

CoreBank is a full-stack banking simulation built to demonstrate backend development, REST API design, database management, authentication, and frontend integration.

The application allows users to register, log in, view their account balance, deposit and withdraw funds, transfer money, and review their transaction history.

## Features

- **User Authentication:** Registration and login with BCrypt password hashing and JWT-based authentication.
- **Account Dashboard:** View account balance and banking activity.
- **Deposits and Withdrawals:** Perform transactions with input validation.
- **Fund Transfers:** Transfer funds with balance checks and transaction handling.
- **Transaction History:** View recorded account transactions.
- **Security:** Authenticated endpoints and account ownership checks.
- **Database Migrations:** Manage database schema using Flyway.
- **Error Handling:** Centralized exception handling and validation.
- **Automated Testing:** Backend tests using JUnit.

## Technology Stack

### Backend
- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA and Hibernate
- MySQL 8
- Flyway
- Maven
- JWT and BCrypt
- JUnit

### Frontend
- React
- Vite
- JavaScript
- HTML and CSS
- Fetch API

## Project Structure

```text
CoreBank/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/corebank/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before running the application:

- Java 17
- Maven
- MySQL 8
- Node.js and npm
- Git

## Configuration

The backend uses environment variables for its database password and JWT secret.

Configure these variables in the terminal where you run the backend:

- `COREBANK_DB_PASSWORD` — password for the MySQL application user.
- `COREBANK_JWT_SECRET` — Base64-encoded secret containing at least 32 bytes of key material.

Create the MySQL database and application user according to your local configuration. The backend's Flyway migration creates the application tables.

The database URL and username are configured in `backend/src/main/resources/application.properties`.

**Never commit real passwords, JWT secrets, or other credentials to GitHub.**

## Running the Application

### 1. Start the backend

Open a terminal in the `backend` directory, configure the required environment variables, and run:

```bash
mvn spring-boot:run
```

The backend uses port `8080` by default.

### 2. Start the frontend

Open another terminal in the `frontend` directory and run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.

Ensure the backend, MySQL database, and frontend API configuration are set up correctly before testing the application.

## Testing

To run the backend tests:

```bash
mvn test
```

Run the command from the `backend` directory with any required test environment configuration in place.

## Learning Objectives

This project demonstrates practical experience with:

- Designing REST APIs using Spring Boot
- Structuring applications with controllers, services, and repositories
- Integrating React with a Java backend
- Working with relational databases and JPA
- Implementing JWT authentication and password hashing
- Validating requests and handling errors
- Managing schema changes and writing automated tests

## Disclaimer

CoreBank is an educational portfolio project. It is a banking simulation and is **not intended for real financial transactions or production banking use**.
