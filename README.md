![CredNova Explainable AI Hero Image](./images/crednova_hero.png)

# TechNova: AI-Powered Loan Decision & Analytics Platform

TechNova is an advanced, enterprise-grade AI-powered financial platform that automates loan applications, evaluates credit default risk using Deep Learning models, explains decisions using LangGraph agentic workflows, and analyzes demographic fairness.

This repository consists of a modular three-tier architecture:
1. **TechNova_Frontend**: A sleek React 19 single-page application built with Vite, Tailwind CSS, Framer Motion, and GSAP.
2. **TechNova_Backend (Node.js)**: A secure RESTful API gateway built on Express 5, Mongoose 9, and MongoDB, handling user management, authentication, and loan status lifecycle.
3. **TechNova_Backend (Python Flask)**: A microservice hosting the Deep Learning ANN model for risk prediction and a LangGraph agent workflow powered by Groq (Llama-3.3) for decision explanation.

---

## 🛠️ Complete Tech Stack List (Every Single Dependency)

### 1. Frontend Client (`TechNova_Frontend`)
*   **Core Framework**: React 19 (v19.2.0) & React DOM (v19.2.0)
*   **Build System**: Vite (v7.3.1) with `@vitejs/plugin-react` (v5.1.1)
*   **State Management**: Redux Toolkit (v2.11.2) & React Redux (v9.2.0)
*   **Routing**: React Router DOM (v7.13.0)
*   **Styling & UI**: Tailwind CSS (v3.4.19), PostCSS (v8.5.6), Autoprefixer (v10.4.24), `clsx` (v2.1.1), `tailwind-merge` (v3.5.0)
*   **Animations**: Framer Motion (v12.34.2), GSAP (v3.14.2), `@gsap/react` (v2.1.2)
*   **Charts & Visualizations**: Recharts (v3.7.0)
*   **Icons**: Lucide React (v0.575.0)
*   **Notifications**: React Hot Toast (v2.6.0), Toastify (v2.0.1)
*   **Linting & Quality**: ESLint (v9.39.1), globals (v16.5.0)

### 2. Primary Backend Gateway (`TechNova_Backend/Backend`)
*   **Runtime Environment**: Node.js
*   **Web Framework**: Express (v5.2.1)
*   **Database ODM**: Mongoose (v9.2.1)
*   **Authentication & Security**:
    *   JSON Web Tokens (`jsonwebtoken` v9.0.3)
    *   Blowfish Hashing (`bcryptjs` v3.0.3)
    *   Cookie Parser (`cookie-parser` v1.4.7)
    *   Rate Limiter (`express-rate-limit` v8.2.1)
    *   Cross-Origin Resource Sharing (`cors` v2.8.6)
*   **Utilities & Services**:
    *   Email Delivery: Nodemailer (v8.0.1)
    *   Environment Configurations: Dotenv (v17.3.1)
    *   Express Async Handler (`express-async-handler` v1.2.0)
*   **Development Tools**: Nodemon (v3.1.13)

### 3. ML Risk & LLM Microservice (`TechNova_Backend`)
*   **Runtime Environment**: Python (3.9+)
*   **Web Framework**: Flask & Flask-CORS
*   **Data Processing**: Pandas, NumPy, Scikit-learn (loaded via Pickle)
*   **Deep Learning Engine**: TensorFlow / Keras (running Artificial Neural Network model `.h5`)
*   **Agentic LLM Framework**: LangGraph
*   **LLM Provider Client**: Groq SDK (`groq`) for Llama-3.3-70b-versatile inference
*   **Database Connectivity**: PyMongo (MongoDB Client)
*   **Configuration**: Python-dotenv

### 4. Shared Infrastructure
*   **Database**: MongoDB (MongoDB Atlas cloud instance)
*   **LLM Engine**: Groq Cloud Platform (utilizing Llama-3.3-70b-versatile)

---

## 🚀 Key Platform Features

### 🔒 Secure Authentication & User Flow
*   **OTP-Verified Onboarding**: Double-hop verification loop during Sign Up and Forgot Password via custom Nodemailer services. Includes a development-mode console fallback.
*   **JWT Token Authorization**: Cryptographically signed access tokens sent via secure HTTP-Only Cookies and response headers.
*   **Role-Based Access Control (RBAC)**: Custom middlewares segregation of standard User routes (`/dashboard`, `/apply`) and Admin interfaces (`/admin/*`).

### 📊 AI Credit Score & Loan Default Prediction
*   **Deep Learning Evaluation**: An Artificial Neural Network (ANN) trained on loan historical records models risk of default using TensorFlow.
*   **DTI & Asset Calibration**: Numerical properties such as Debt-to-Income (DTI) ratio, credit history age, monthly income, and loan amount are normalized through `preprocessor.pkl`.
*   **Risk Level Categorization**: Automatically groups users into Low Risk, Medium Risk, and High Risk profiles based on neural probability outputs.

### 🧠 Agentic LLM Explanations (LangGraph & Groq)
*   Instead of returning a simple raw score, the platform uses a 4-Node LangGraph State Graph workflow:
    ```mermaid
    graph TD
        A[Start] --> B[analyze_rejection_reasons]
        B --> C[generate_improvements]
        C --> D[identify_risk_factors]
        D --> E[format_final_response]
        E --> F[End]
    ```
    *   **Node 1 (`analyze_rejection_reasons`)**: Analyzes feature importance gradients of the neural network and explains why the decision was made.
    *   **Node 2 (`generate_improvements`)**: Formulates 5 actionable financial tips tailored to improve approval chance.
    *   **Node 3 (`identify_risk_factors`)**: Classifies demographic/financial variables into risk-increasing or risk-decreasing buckets.
    *   **Node 4 (`format_final_response`)**: Synthesizes details into clean structural JSON.

### ⚖️ Demographic Fairness Engine
*   **Bias Evaluation**: Tracks selection rates, statistical parity, and equal opportunity ratios across protected attributes (e.g., Age ranges, Marital Status, Education levels).
*   **Drift & Bias Warnings**: Admin panel alerts notify staff when approval rate variances exceed target thresholds.

### 🎛️ Interactive What-If Simulator
*   **Live Parameter Adjustments**: Real-time slider calculations allow users/staff to change parameters (Income, Debt, Credit Age, Recent Inquiries) and visualize expected score swings.
*   **Micro-Animations**: Features smooth physics and spring animations for numbers and status indicators via Framer Motion.

---

## 📁 Repository Directory Structure

```
Technova/
│
├── 📁 TechNova_Frontend/           # React + Vite Client
│   ├── 📁 src/
│   │   ├── 📁 components/          # Reusable modules (admin/user/auth/common/charts)
│   │   ├── 📁 redux/               # Redux state slices & store config
│   │   ├── 📁 pages/               # Page layouts (Home, Login, Dashboard, About)
│   │   ├── 📁 services/            # Axios API handlers (operations/endpoints)
│   │   └── 📄 App.jsx              # React router configuration
│   └── 📄 package.json
│
├── 📁 TechNova_Backend/            # Backend Services
│   │
│   ├── 📁 Backend/                 # Node.js + Express API Gateway
│   │   ├── 📁 Configuration/       # Database & environment variables
│   │   ├── 📁 Controllers/         # Auth, Loan CRUD, Admin Actions
│   │   ├── 📁 Modals/              # MongoDB Schemas (User, LoanApplication, etc.)
│   │   ├── 📁 Routes/              # API endpoints definition
│   │   └── 📄 App.js               # Global middlewares & error handlers
│   │
│   ├── 📄 app.py                   # Python Flask Server (ML Prediction API)
│   ├── 📄 model_utils.py           # TensorFlow model evaluation & gradients
│   ├── 📄 llm_utils.py             # LangGraph workflow using Groq Client
│   ├── 📄 requirements.txt         # Python package requirements
│   └── 📄 ann_model.h5             # Saved Keras ANN model weights
│
└── 📄 README.md                    # Core Documentation
```

---

## ⚙️ How to Run Locally

### 1. Database Setup
1. Create a MongoDB database (either a local installation or MongoDB Atlas cluster).
2. Grab your connection URI.

### 2. Configure Environment Variables
Create a `.env` file inside `TechNova_Backend/` with the following variables:
```env
# Node Backend Config
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/loan_management
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

# Mail Service config (for OTP delivery)
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_gmail_app_password

# Flask Config
FLASK_PORT=8000
SECRET_KEY=your_flask_secret_key
GROQ_API_KEY=your_groq_api_key
```

### 3. Run the Node.js API Gateway
```bash
cd TechNova_Backend/Backend
npm install
npm run dev
```

### 4. Run the Python ML Microservice
```bash
cd TechNova_Backend
pip install -r requirements.txt
python app.py
```

### 5. Run the React Frontend Client
Create a `.env` in `TechNova_Frontend/`:
```env
VITE_APP_BASE_URL=http://localhost:5000/api/v1
VITE_PREDICT_BASE_URL=http://localhost:8000
```
Then execute:
```bash
cd TechNova_Frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🌐 Production Hosting Guidelines

When deploying this project to a live hosting provider (e.g., AWS, GCP, Vercel, Render, or DigitalOcean), separate the tiers for optimal performance:

### 1. Database (MongoDB)
*   Use **MongoDB Atlas** (Shared or Dedicated tier).
*   Add your deployment servers' IPs to the MongoDB Atlas Network Access whitelist.

### 2. Frontend Client (React)
*   **Vite Static Build**: Run `npm run build` to output the optimized files in `dist/`.
*   **Hosting**: Host the static assets on **Vercel**, **Netlify**, **Render**, or an **AWS S3 bucket + CloudFront** CDN.
*   Make sure to configure rewrite rules to redirect all routes back to `index.html` (Single-Page App routing support).

### 3. Node.js Backend Gateway
*   **Hosting**: Deploy to **Render Web Service**, **Railway**, **Heroku**, or a Dockerized container on **AWS ECS / DigitalOcean App Platform**.
*   Configure the environment variables (`MONGO_URI`, `JWT_SECRET`, etc.) inside the hosting provider dashboard.
*   Make sure to set `CLIENT_URL` to point to your frontend domain to ensure CORS handles requests properly.

### 4. Python Flask ML Microservice
*   **Note**: TensorFlow makes Python containers larger. Deploy to a service with adequate RAM (minimum 1GB recommended).
*   **Hosting**: Deploy to **Render** (via Docker or Python environment), **Railway**, or **AWS App Runner / ECS**.
*   Verify that your `GROQ_API_KEY` is configured in the environment.
