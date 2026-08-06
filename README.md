````markdown
# 🌍 AOD Predictor

> **A Full-Stack Machine Learning Web Application for Predicting Aerosol Optical Depth (AOD)**

![Python](https://img.shields.io/badge/Python-3.10+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933)
![JavaScript](https://img.shields.io/badge/JavaScript-Frontend-F7DF1E)
![Machine Learning](https://img.shields.io/badge/Machine%20Learning-Random%20Forest-success)
![License](https://img.shields.io/badge/License-MIT-green)

---

# 📖 Overview

**AOD Predictor** is a Full-Stack Machine Learning application developed as a **B.Tech Final Year Project** to predict **Aerosol Optical Depth (AOD)** using environmental and satellite-derived parameters.

The application integrates a responsive web interface, a RESTful backend API, and a dedicated Machine Learning service to provide accurate AOD predictions for environmental monitoring and research.

The system follows a modular architecture where each component is independent, making it scalable, maintainable, and easy to deploy.

---

# 🎯 Problem Statement

Atmospheric aerosols influence:

- Air Quality
- Climate Change
- Weather Forecasting
- Environmental Health
- Atmospheric Research

Traditional AOD estimation requires sophisticated instruments and satellite processing. This project demonstrates how Machine Learning can estimate Aerosol Optical Depth using environmental features through a web-based prediction system.

---

# 🚀 Features

- 🌍 Aerosol Optical Depth Prediction
- 🤖 Machine Learning Prediction Engine
- ⚡ FastAPI ML Service
- 🌐 Node.js REST Backend
- 💻 Responsive Web Interface
- 📊 Real-Time Predictions
- 🔗 Modular Architecture
- 📦 Easy Deployment
- 🚀 Fast Prediction Response
- 📈 Scalable System Design

---

# 🏗️ System Architecture

```text
                    User
                      │
                      ▼
             Frontend (HTML/CSS/JS)
                      │
                HTTP Request
                      │
                      ▼
            Node.js + Express Backend
                      │
          REST API Communication
                      │
                      ▼
          FastAPI Machine Learning API
                      │
             Random Forest Model
                      │
                      ▼
               Predicted AOD Value
                      │
                      ▼
              Response to Frontend
```

---

# 🛠️ Tech Stack

## Frontend

- HTML5
- CSS3
- JavaScript

## Backend

- Node.js
- Express.js

## Machine Learning

- Python
- FastAPI
- Uvicorn
- Scikit-Learn
- Pandas
- NumPy
- Joblib

## Tools

- Git
- GitHub
- VS Code

---

# 📂 Project Structure

```text
AOD-PREDICTOR/
│
├── frontend/
│   ├── css/
│   ├── js/
│   ├── images/
│   ├── pages/
│   └── index.html
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── config/
│   ├── server.js
│   └── package.json
│
├── aodModel/
│   ├── dataset/
│   ├── model/
│   ├── main.py
│   ├── train.py
│   ├── predict.py
│   ├── requirements.txt
│   └── rf_model.pkl
│
├── README.md
├── package.json
└── .gitignore
```

---

# ⚙️ Machine Learning Pipeline

```text
Dataset
     │
     ▼
Data Cleaning
     │
     ▼
Feature Engineering
     │
     ▼
Train-Test Split
     │
     ▼
Random Forest Regressor
     │
     ▼
Model Evaluation
     │
     ▼
Model Serialization (.pkl)
     │
     ▼
FastAPI Prediction API
```

---

# 📊 Model Information

| Property | Value |
|-----------|-------|
| Problem Type | Regression |
| Algorithm | Random Forest Regressor |
| Language | Python |
| Framework | Scikit-Learn |
| Model Serving | FastAPI |
| API Server | Uvicorn |
| Model Storage | Joblib (.pkl) |

---

# 🔄 Application Workflow

```text
User

↓

Frontend

↓

Backend API

↓

FastAPI Prediction Service

↓

Machine Learning Model

↓

Predicted AOD

↓

Backend

↓

Frontend

↓

User
```

---

# 🚀 Installation

## Clone the Repository

```bash
git clone https://github.com/prajyoth2006/AOD-PREDICTOR.git

cd AOD-PREDICTOR
```

---

## Backend Setup

```bash
cd backend

npm install

npm start
```

---

## Machine Learning Setup

```bash
cd aodModel

pip install -r requirements.txt

uvicorn main:app --reload --port 2000
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm start
```

---

# 🌐 API Workflow

```text
Frontend
     │
POST Request
     │
     ▼
Backend
     │
POST Request
     │
     ▼
FastAPI
     │
Prediction
     │
     ▼
Backend
     │
JSON Response
     │
     ▼
Frontend
```

---

# 📈 Applications

- Air Quality Monitoring
- Pollution Analysis
- Atmospheric Science
- Climate Change Research
- Environmental Monitoring
- Academic Research
- Scientific Data Analysis

---

# 🔮 Future Improvements

- Deep Learning Models
- XGBoost and LightGBM Comparison
- Explainable AI using SHAP
- Docker Containerization
- CI/CD Pipeline
- Kubernetes Deployment
- AWS/Azure/GCP Deployment
- User Authentication
- Prediction History Dashboard
- Interactive Data Visualization
- GIS Map Integration
- Live Weather API Integration
- Batch Prediction Support
- Model Monitoring

---

# 📚 Future Scope

Future versions of the project may include:

- Satellite Image Processing
- Time-Series AOD Forecasting
- Ensemble Machine Learning Models
- Explainable AI
- Mobile Application
- Real-Time Air Quality Dashboard
- Regional Pollution Forecasting
- IoT Sensor Integration
- Automated Model Retraining
- Cloud-Based Prediction Services

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to GitHub

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**M. Prajyoth**

B.Tech, Civil Engineering  
Indian Institute of Technology Patna

GitHub: https://github.com/prajyoth2006

---

# ⭐ Support

If you found this project useful, please consider giving it a **Star ⭐**.

Your support helps improve the project and motivates future development.
````
