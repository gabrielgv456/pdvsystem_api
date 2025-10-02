# 🔌 PDV System API

RESTful API backend for the PDV (Point of Sale) System, providing endpoints for products, sales, inventory, users, and more.

---

## 📑 Table of Contents

- [ℹ️ About](#ℹ️-about)  
- [✨ Features](#✨-features)  
- [🛠 Tech Stack](#🛠-tech-stack)  
- [🚀 Getting Started](#🚀-getting-started)  
  - [✅ Prerequisites](#✅-prerequisites)  
  - [📥 Installation](#📥-installation)  
  - [▶️ Running Locally](#▶️-running-locally)  
  - [🧪 Running Tests](#🧪-running-tests)  
- [⚙️ Configuration / Environment Variables](#⚙️-configuration--environment-variables)  
- [📂 Project Structure](#📂-project-structure)  
- [🧩 API Endpoints / Routes](#🧩-api-endpoints--routes)  
- [📦 Deployment](#📦-deployment)  
- [🤝 Contributing](#🤝-contributing)  
- [📜 License](#📜-license)  
- [📧 Contact](#📧-contact)  

---

## ℹ️ About

This project implements the backend API for the PDV System.  
It handles data operations for products, sales, inventory, user management, authentication, and more.

---

## ✨ Features

- 📦 CRUD operations for products, inventory, sales  
- 🔐 User authentication (login, roles, permissions)  
- 📊 Reporting endpoints (e.g. sales summary, inventory status)  
- 🗄️ Database integration (Prisma)  
- 📈 Input validation, error handling  
- 🔁 Pagination, filtering, sorting  

---

## 🛠 Tech Stack

- ⚙️ Backend framework: Express  
- 🟠 Language:  TypeScript  
- 🗄️ Database: PostgreSQL  
- 🔐 Authentication: JWT  
- 📦 ORM / Query Builder: Prisma

---

## 🚀 Getting Started

### ✅ Prerequisites

Make sure you have:

- 🟩 Node.js (e.g. ≥ 16.x)  
- 📦 npm or yarn  
- 🗄️ A running database instance (PostgreSQL)  
- 🔑 Git  

### 📥 Installation

```bash
git clone https://github.com/gabrielgv456/pdvsystem_api.git
cd pdvsystem_api
npm install
# or
yarn
````

### ▶️ Running Locally

Set up your environment variables (see below), then:

```bash
npm run dev
# or
yarn dev
```

The server should start on a configured port (e.g. `http://localhost:4000`).

---

## ⚙️ Configuration / Environment Variables

Use a `.env` file at the project root. Example:

```dotenv
TOKEN_API=
CONVERTERXMLAPI_URL=
FISCALAPI_TOKEN_GENARATE_AUTH = 
DATABASE_URL=
FISCALAPI_URL=
```
---

## 📦 Deployment

You can deploy the API to:

* Heroku
* AWS (EC2, Lambda + API Gateway, Elastic Beanstalk)
* DigitalOcean
* Azure
* Render

Ensure environment variables are set in your deployment environment, and your database is accessible. Use a production database and secure secrets appropriately.

---

## 🤝 Contributing

1. 🍴 Fork the repo
2. 🌱 Create a branch: `git checkout -b feature/your-feature`
3. 🛠 Add your changes & tests
4. 🧪 Ensure tests pass
5. 📤 Push branch & open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License**. See `LICENSE` for details.

---

## 📧 Contact

👤 Author: [Gabriel Gonçalves](https://github.com/gabrielgv456)
📩 For issues or feature requests, use the GitHub [Issues tab](https://github.com/gabrielgv456/pdvsystem_api/issues)

---

⭐ If you find this API useful, give the repo a ⭐ on GitHub!
