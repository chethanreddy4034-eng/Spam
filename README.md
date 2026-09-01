# 🛡️ Email Spam Filter — Multinomial Naive Bayes Classifier

An interactive, presentation-ready web application and machine learning engine that uses **Multinomial Naive Bayes** to classify emails as **HAM (Legitimate)** or **SPAM**.

Built with pure Python (zero external pip dependencies) and a fast client-side engine that works autonomously in any browser and on **GitHub Pages**.

---

## 🌟 Key Features

1. **⚡ Live Email Classifier (Tab 1)**:
   - **One-Click Test Samples**: 6 curated presets (3 Spam scams/phishing, 3 Ham work/personal emails).
   - **Real-Time Classification**: Instant prediction as you type with debounced processing.
   - **Visual Probability Meter**: Dynamic progress bar showing exact Ham % vs. Spam % split.
   - **Confidence Score**: Clear percentage indicator for prediction reliability.
   - **Trigger Keyword Badges**: Visual highlights of the strongest words influencing the decision.
   - **Token Likelihood Table**: Deep-dive table detailing each word's $P(\text{Word} \mid \text{Spam})$, $P(\text{Word} \mid \text{Ham})$, Log-Odds, and classification impact.
   - **Bayes Math Card**: Dynamic formula breakdown explaining the calculation in log-space.

2. **📐 Bayes' Theorem Math (Tab 2)**:
   - Educational breakdown of the 4 core mathematical principles:
     1. **Bayes' Theorem**: Posterior probability estimation.
     2. **Laplace Smoothing ($\alpha=1.0$)**: Eliminates zero-frequency probabilities for unseen words.
     3. **Log-Space Computation**: Replaces tiny probability multiplications with stable additions to prevent floating-point underflow.
     4. **The Naive Assumption**: Conditional independence assumption between word occurrences.

3. **📊 Dataset & Vocabulary Explorer (Tab 3)**:
   - High-level metric cards: Total training samples, unique vocabulary size, Ham/Spam split, test accuracy (100%).
   - Top 12 Spam and Top 12 Ham vocabulary keywords with frequency badges.
   - **Interactive Training Dataset Browser**: Filter by "All", "Ham", or "Spam", search emails live by keyword, and click **"⚡ Test"** on any email to immediately load and analyze it in the Live Classifier!

4. **➕ Train Custom Data (Tab 4)**:
   - Easily add custom Ham or Spam emails.
   - Retrains the model in milliseconds.
   - Works both online (persisting to backend JSON files) and offline (updating in-browser session model).

5. **🎨 Modern UI & Polish**:
   - Dark Mode / Light Mode toggle persisted in `localStorage`.
   - Glassmorphism design with responsive layout for mobile, tablet, and desktop.

---

## 🚀 How to Run

### Method 1: Local Python Server (Recommended for Demos)
1. Open a terminal in the project directory:
   ```bash
   python app.py
   ```
2. Open your browser and navigate to:
   ```
   http://127.0.0.1:5000  or  http://localhost:5000
   ```

### Method 2: Standalone / GitHub Pages (Static Offline Mode)
- **Direct Local File**: Double-click `index.html` in Windows File Explorer.
- **GitHub Pages**: Host the repository directly on GitHub Pages. The standalone client-side engine automatically runs all classifications, stats, and dataset explorer features with zero server required!

---

## 🧪 Testing & Model Training

- **Run Automated Unit Tests**:
  ```bash
  python test_model.py
  ```
- **Retrain and Evaluate Dataset**:
  ```bash
  python train.py
  ```

---

## 📁 Repository Structure

```
├── index.html            # Standalone main frontend web application
├── app.py                # Pure Python HTTP Web Server & REST API endpoints
├── model.py              # Multinomial Naive Bayes Classifier implementation
├── train.py              # Model training, test split, and evaluation script
├── test_model.py         # Unit tests covering classification and edge cases
├── requirements.txt      # Project requirements
├── README.md             # Project documentation & presentation guide
├── static/
│   ├── app.js            # Frontend logic, client-side Bayes engine, & dataset explorer
│   └── style.css         # Glassmorphism styling, dark/light themes, responsive layout
├── templates/
│   └── index.html        # HTML template served by backend web server
└── data/
    ├── spam_dataset.json # Cleaned 36-sample balanced training dataset
    └── vocabulary.json   # Exported vocabulary counts & model parameters
```

---

## 🎓 Presentation Guide (Tips for Presenting)

1. **Introduction**: Introduce the problem of spam detection and why Naive Bayes is an industry-standard baseline for NLP classification.
2. **Live Demo (Tab 1)**:
   - Click the **"💰 Lottery Grand Prize"** sample chip to show instant detection (Spam).
   - Click the **"📊 Q3 Sprint Review"** sample chip to show legitimate email detection (Ham).
   - Point out the **Token Likelihood Breakdown** table to show word-level explainability.
3. **Mathematical Theory (Tab 2)**: Explain Laplace smoothing and log-space addition.
4. **Dataset & Vocabulary (Tab 3)**: Showcase the **Top Spam Vocabulary** (e.g. `free`, `lottery`, `urgent`, `currency`) vs **Top Ham Vocabulary** (`meeting`, `review`, `team`, `schedule`), and use the interactive search bar to find emails in the dataset.
5. **Interactive Training (Tab 4)**: Enter a new email (e.g., *"Urgent discount for VIP members"*) and demonstrate real-time model retraining.
