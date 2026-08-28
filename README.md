# 🛡️ Email Spam Filter (Naive Bayes Classifier Web App)

An interactive, responsive web application and machine learning engine that uses **Multinomial Naive Bayes** to classify emails as **HAM (Legitimate)** or **SPAM**.

---

## ✨ Features

- **Multinomial Naive Bayes Algorithm**:
  - Implemented in pure Python with zero mandatory pip dependencies.
  - Laplace smoothing (\(\alpha = 1.0\)) for handling out-of-vocabulary words.
  - Log-space probability computations to eliminate floating-point underflow.
- **Explainable AI (XAI)**:
  - Highlights exact trigger keywords (e.g., *lottery, urgent, bank, verify, free, prize*).
  - Word-level log-odds contribution and token likelihood table.
- **Easy-to-use Modern Web Interface**:
  - **1-Click Pre-loaded Samples**: Test common phishing, scams, work meetings, and receipts with a single click.
  - **Real-Time Live Analysis**: Automatically calculates spam confidence as you type.
  - **Visual Confidence Gauge & Progress Bars**: Shows exact Ham vs. Spam probabilities.
  - **Bayes' Theorem Visualizer**: Step-by-step breakdown of priors, likelihoods, and posterior math.
  - **Dataset Inspector & Retraining**: View vocabulary frequency statistics and add custom training emails dynamically.
- **Zero-Setup Quickstart**:
  - Option 1: Run with `python app.py` (Local REST API web server).
  - Option 2: Double-click `index.html` to run in standalone offline mode in any web browser.

---

## 🚀 How to Run

### Method 1: Run with Python Web Server (Recommended)

1. Open your terminal or Command Prompt in this folder:
   ```bash
   cd "c:\Users\KRISHIKA S REDDY\OneDrive\Desktop\email-spam-filter"
   ```
2. Start the application:
   ```bash
   python app.py
   ```
3. Open your browser and navigate to:
   ```
   http://127.0.0.1:5000  or  http://localhost:5000
   ```

---

### Method 2: Direct Browser Launch (Offline)

Simply open the file in your favorite browser:
- Double-click `index.html` in Windows File Explorer.

---

## 📁 Project Structure

```
email-spam-filter/
├── index.html            # Standalone modern web app (Frontend UI + Embedded Naive Bayes Engine)
├── static/
│   ├── style.css         # Responsive glassmorphism styling & dark/light theme
│   └── app.js            # Live typing handler, API client, and visual gauges
├── templates/
│   └── index.html        # Web template for backend serving
├── data/
│   ├── spam_dataset.json # Curated training dataset (Ham & Spam samples)
│   └── vocabulary.json   # Exported vocabulary & class probability weights
├── model.py              # Pure Python Multinomial Naive Bayes Classifier
├── app.py                # Zero-dependency HTTP Server & REST API endpoints
├── train.py              # Training script & validation metric evaluator
├── test_model.py         # Unit tests covering test cases and edge conditions
├── requirements.txt      # Optional requirements
└── README.md             # Project documentation
```

---

## 🧪 Running Tests & Retraining

- **Run Unit Tests**:
  ```bash
  python test_model.py
  ```
- **Retrain Model and Evaluate Metrics**:
  ```bash
  python train.py
  ```
