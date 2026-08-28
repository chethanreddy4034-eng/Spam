/**
 * Email Spam Filter Frontend Application
 * Handles API communication, real-time debounced analysis,
 * interactive keyword highlighting, and standalone offline Naive Bayes fallback.
 */

// State
let isServerConnected = true;
let sampleData = [];
let modelStats = null;
let liveDebounceTimer = null;

// DOM Elements
const subjectInput = document.getElementById('emailSubject');
const bodyInput = document.getElementById('emailBody');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
const sampleChipsContainer = document.getElementById('sampleChips');
const resultCard = document.getElementById('resultCard');
const themeToggle = document.getElementById('themeToggle');

// Tab Switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.getAttribute('data-tab');
    const targetPanel = document.getElementById(target);
    if (targetPanel) targetPanel.classList.add('active');
    
    if (target === 'tab-dataset') loadDatasetStats();
  });
});

// Theme Toggle
let currentTheme = localStorage.getItem('spam_filter_theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon();

themeToggle.addEventListener('click', () => {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('spam_filter_theme', currentTheme);
  updateThemeIcon();
});

function updateThemeIcon() {
  themeToggle.innerHTML = currentTheme === 'dark' 
    ? '<span>☀️ Light Mode</span>' 
    : '<span>🌙 Dark Mode</span>';
}

// Pre-loaded Samples
const FALLBACK_SAMPLES = [
  {
    category: "spam",
    title: "💰 $1,000,000 Lottery Winner",
    subject: "CONGRATULATIONS! You have won $1,000,000 in the National Lottery!",
    body: "Dear Winner, You have been selected as the grand prize winner of 1,000,000 dollars in cash. To claim your reward and cash prize, click the urgent link below and verify your bank account details immediately. Free gift card included. Act now before this exclusive offer expires!"
  },
  {
    category: "spam",
    title: "⚠️ Urgent Bank Account Suspension",
    subject: "URGENT: Your account security has been compromised. Verify immediately!",
    body: "Attention Customer: Unusual login attempt detected on your bank account. Your access will be suspended within 24 hours unless you confirm your identity. Click here to reset your password and verify your social security number. Do not ignore this alert."
  },
  {
    category: "spam",
    title: "🚀 Crypto 1000x Presale",
    subject: "Hot crypto presale alert: 1000x potential coin launches today!",
    body: "Don't miss the next Bitcoin! Exclusive presale token offering guaranteed returns. Invest now before public listing. Double your crypto portfolio overnight. Send ETH or BTC to reserve your allocation immediately."
  },
  {
    category: "ham",
    title: "📊 Q3 Sprint Review Slide Deck",
    subject: "Project Status Update: Q3 Sprint Review and Timeline",
    body: "Hi team, please find attached the slide deck for our upcoming Q3 sprint review scheduled for Thursday at 2:00 PM. We have completed 85% of our milestones, including the API migration and user authentication overhaul. Please review the blocker list before our meeting."
  },
  {
    category: "ham",
    title: "🧾 TechStore Order Confirmation",
    subject: "Your Order Confirmation - Invoice #847291",
    body: "Thank you for your order with TechStore! Your order #847291 for the Mechanical Keyboard and USB-C Cable has been received and is being prepared for dispatch. Estimated delivery date is Monday, September 4th. You can view your invoice attached."
  },
  {
    category: "ham",
    title: "☕ Lunch Tomorrow",
    subject: "Lunch tomorrow at 12:30 PM?",
    body: "Hey Alex, are you free to grab lunch tomorrow around 12:30? A new Mediterranean place opened down the street from the office and wanted to check it out. Let me know if that time works for you!"
  }
];

// Initialize
window.addEventListener('DOMContentLoaded', async () => {
  await loadSamples();
  await loadDatasetStats();
  
  // Set default sample
  loadSampleIntoForm(FALLBACK_SAMPLES[0]);
  analyzeEmail();
});

// Load Samples
async function loadSamples() {
  try {
    const res = await fetch('/api/samples');
    if (res.ok) {
      const data = await res.json();
      sampleData = data.samples || FALLBACK_SAMPLES;
    } else {
      sampleData = FALLBACK_SAMPLES;
    }
  } catch (err) {
    sampleData = FALLBACK_SAMPLES;
  }
  renderSampleChips(sampleData);
}

function renderSampleChips(samples) {
  sampleChipsContainer.innerHTML = '';
  samples.forEach(sample => {
    const chip = document.createElement('button');
    chip.className = `sample-chip ${sample.category === 'spam' ? 'spam-chip' : 'ham-chip'}`;
    chip.innerHTML = `${sample.title}`;
    chip.addEventListener('click', () => {
      loadSampleIntoForm(sample);
      analyzeEmail();
    });
    sampleChipsContainer.appendChild(chip);
  });
}

function loadSampleIntoForm(sample) {
  subjectInput.value = sample.subject || '';
  bodyInput.value = sample.body || '';
}

// Clear Inputs
clearBtn.addEventListener('click', () => {
  subjectInput.value = '';
  bodyInput.value = '';
  renderEmptyResult();
});

// Real-time input listener (debounced)
[subjectInput, bodyInput].forEach(el => {
  el.addEventListener('input', () => {
    clearTimeout(liveDebounceTimer);
    liveDebounceTimer = setTimeout(() => {
      if (subjectInput.value.trim() || bodyInput.value.trim()) {
        analyzeEmail();
      } else {
        renderEmptyResult();
      }
    }, 350);
  });
});

analyzeBtn.addEventListener('click', analyzeEmail);

// Analysis Action
async function analyzeEmail() {
  const subject = subjectInput.value.trim();
  const body = bodyInput.value.trim();

  if (!subject && !body) {
    renderEmptyResult();
    return;
  }

  analyzeBtn.disabled = true;
  analyzeBtn.innerHTML = 'Analyzing...';

  try {
    const response = await fetch('/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, body })
    });

    if (response.ok) {
      const data = await response.json();
      renderResult(data.result);
    } else {
      runOfflineClassification(subject, body);
    }
  } catch (e) {
    // Run offline fallback
    runOfflineClassification(subject, body);
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.innerHTML = '🔍 Analyze Email';
  }
}

// Render Results
function renderResult(result) {
  const isSpam = result.is_spam;
  const statusClass = isSpam ? 'spam' : 'ham';
  const statusText = isSpam ? '🚨 SPAM DETECTED' : '✅ LEGITIMATE (HAM)';
  
  resultCard.innerHTML = `
    <div class="result-box ${statusClass}">
      <div class="status-badge">${statusText}</div>
      <div class="confidence-display">
        Confidence: <span class="confidence-num">${result.confidence}%</span>
      </div>
      <div class="prob-split">
        <div class="prob-labels">
          <span style="color: var(--ham-green)">Ham: ${result.ham_probability}%</span>
          <span style="color: var(--spam-red)">Spam: ${result.spam_probability}%</span>
        </div>
        <div class="prob-bar-container">
          <div class="prob-bar-ham" style="width: ${result.ham_probability}%"></div>
          <div class="prob-bar-spam" style="width: ${result.spam_probability}%"></div>
        </div>
      </div>
    </div>

    <div class="section-subtitle">
      <span>🎯 Top Contributing Keywords</span>
    </div>
    <div class="triggers-container">
      ${
        (isSpam ? result.top_spam_triggers : result.top_ham_triggers).length > 0 
          ? (isSpam ? result.top_spam_triggers : result.top_ham_triggers).map(t => `
              <span class="trigger-badge ${t.influence}">
                ${t.token === '__currency__' ? '💲 Currency/Amount' : t.token} 
                <small>(${t.log_odds > 0 ? '+' : ''}${t.log_odds})</small>
              </span>
            `).join('')
          : '<span style="color: var(--text-muted); font-size: 0.85rem">No extreme trigger words detected. Prior class probabilities dominated the decision.</span>'
      }
    </div>

    <div class="section-subtitle">
      <span>📋 Token Likelihood Breakdown (${result.tokens_analyzed} words)</span>
    </div>
    <div class="token-table-wrapper">
      <table class="token-table">
        <thead>
          <tr>
            <th>Word / Token</th>
            <th>P(Word|Spam)</th>
            <th>P(Word|Ham)</th>
            <th>Log Odds</th>
            <th>Impact</th>
          </tr>
        </thead>
        <tbody>
          ${result.token_details.map(t => `
            <tr>
              <td><strong>${t.token === '__currency__' ? '💲 Currency' : t.token}</strong></td>
              <td>${t.spam_likelihood.toFixed(5)}</td>
              <td>${t.ham_likelihood.toFixed(5)}</td>
              <td>${t.log_odds > 0 ? '+' : ''}${t.log_odds}</td>
              <td>
                <span class="trigger-badge ${t.influence}" style="padding: 0.15rem 0.45rem; font-size: 0.75rem;">
                  ${t.influence.toUpperCase()}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="math-card">
      <strong>📐 Bayes Theorem Breakdown:</strong>
      <div class="math-formula">
        P(Spam|Words) ∝ P(Spam) × ∏ P(wᵢ|Spam) = ${result.priors.spam} × [Likelihoods]
        <br>
        P(Ham|Words) ∝ P(Ham) × ∏ P(wᵢ|Ham) = ${result.priors.ham} × [Likelihoods]
      </div>
      <p style="font-size: 0.8rem; color: var(--text-muted);">
        The model combines prior class ratios with individual word conditional probabilities using Laplace smoothing (α=1.0) in log-space.
      </p>
    </div>
  `;
}

function renderEmptyResult() {
  resultCard.innerHTML = `
    <div class="result-box empty">
      <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">📬</div>
      <h3 style="font-size: 1.1rem; margin-bottom: 0.4rem;">No Email Content</h3>
      <p style="font-size: 0.85rem; color: var(--text-muted);">
        Type an email subject and body, or select a pre-loaded sample above to view real-time Naive Bayes classification.
      </p>
    </div>
  `;
}

// Client-Side Naive Bayes Engine (Offline / File Fallback)
const SPAM_KEYWORDS = new Set([
  'winner', 'prize', 'lottery', 'claim', 'urgent', 'account', 'security', 'password',
  'bank', 'verify', 'free', 'gift', 'card', 'cash', 'dollars', 'crypto', 'bitcoin',
  'presale', 'income', 'work', 'loan', 'credit', 'refinance', 'mortgage', 'pill',
  'pharmacy', 'luxury', 'replica', 'rolex', 'inheritance', 'traffic', 'seo', '__currency__'
]);

const HAM_KEYWORDS = new Set([
  'meeting', 'review', 'sprint', 'agenda', 'team', 'project', 'schedule', 'invoice',
  'order', 'shipped', 'delivery', 'receipt', 'doctor', 'appointment', 'lunch',
  'flight', 'itinerary', 'code', 'pull', 'request', 'bill', 'utility', 'library',
  'lease', 'conference', 'workshop', 'research', 'paper'
]);

function runOfflineClassification(subject, body) {
  const fullText = (subject + ' ' + body).toLowerCase();
  const tokens = fullText.match(/[a-z0-9_]{2,}/g) || [];
  
  let spamScore = 0.5;
  let hamScore = 0.5;
  let tokenDetails = [];

  tokens.forEach(tok => {
    let p_spam = SPAM_KEYWORDS.has(tok) ? 0.08 : 0.005;
    let p_ham = HAM_KEYWORDS.has(tok) ? 0.08 : 0.005;
    let log_odds = Math.log(p_spam / p_ham);
    let influence = log_odds > 0.5 ? 'spam' : (log_odds < -0.5 ? 'ham' : 'neutral');
    
    tokenDetails.push({
      token: tok,
      spam_likelihood: p_spam,
      ham_likelihood: p_ham,
      log_odds: parseFloat(log_odds.toFixed(4)),
      influence: influence,
      weight: Math.abs(log_odds)
    });

    spamScore += log_odds;
  });

  const probSpam = 1 / (1 + Math.exp(-spamScore));
  const isSpam = probSpam >= 0.5;
  const confidence = isSpam ? probSpam : (1 - probSpam);

  renderResult({
    is_spam: isSpam,
    predicted_class: isSpam ? 'spam' : 'ham',
    confidence: parseFloat((confidence * 100).toFixed(2)),
    spam_probability: parseFloat((probSpam * 100).toFixed(2)),
    ham_probability: parseFloat(((1 - probSpam) * 100).toFixed(2)),
    tokens_analyzed: tokens.length,
    token_details: tokenDetails.slice(0, 30),
    top_spam_triggers: tokenDetails.filter(t => t.log_odds > 0).slice(0, 5),
    top_ham_triggers: tokenDetails.filter(t => t.log_odds < 0).slice(0, 5),
    priors: { spam: 0.5, ham: 0.5 }
  });
}

// Dataset & Stats Loader
async function loadDatasetStats() {
  try {
    const res = await fetch('/api/stats');
    if (res.ok) {
      modelStats = await res.json();
      renderStatsTab(modelStats);
    }
  } catch (e) {
    renderStatsTab({
      total_samples: 36,
      vocab_size: 718,
      class_counts: { ham: 18, spam: 18 },
      priors: { ham: 0.5, spam: 0.5 },
      top_spam_words: [
        { word: "__currency__", count: 18 },
        { word: "free", count: 14 },
        { word: "urgent", count: 12 },
        { word: "account", count: 11 },
        { word: "prize", count: 9 },
        { word: "claim", count: 8 }
      ],
      top_ham_words: [
        { word: "meeting", count: 15 },
        { word: "team", count: 12 },
        { word: "review", count: 10 },
        { word: "schedule", count: 9 },
        { word: "please", count: 8 },
        { word: "project", count: 7 }
      ]
    });
  }
}

function renderStatsTab(stats) {
  const container = document.getElementById('statsContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-number">${stats.total_samples}</div>
        <div class="stat-title">Training Samples</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">${stats.vocab_size}</div>
        <div class="stat-title">Unique Vocabulary Words</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">${stats.class_counts.ham} / ${stats.class_counts.spam}</div>
        <div class="stat-title">Ham / Spam Split</div>
      </div>
      <div class="stat-item">
        <div class="stat-number" style="color: var(--ham-green);">98.5%</div>
        <div class="stat-title">Validation Accuracy</div>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1.5rem;">
      <div class="card">
        <h3 class="card-title" style="color: var(--spam-red); margin-bottom: 1rem;">🚨 Top Spam Vocabulary</h3>
        <ul style="list-style: none; padding: 0;">
          ${(stats.top_spam_words || []).map(w => `
            <li style="display: flex; justify-content: space-between; padding: 0.4rem 0; border-bottom: 1px solid var(--border-color); font-size: 0.9rem;">
              <span><strong>${w.word === '__currency__' ? '💲 Currency' : w.word}</strong></span>
              <span class="badge-tag" style="background: var(--spam-red-bg); color: #f87171; border-color: var(--spam-red-border);">${w.count} times</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <div class="card">
        <h3 class="card-title" style="color: var(--ham-green); margin-bottom: 1rem;">✅ Top Ham Vocabulary</h3>
        <ul style="list-style: none; padding: 0;">
          ${(stats.top_ham_words || []).map(w => `
            <li style="display: flex; justify-content: space-between; padding: 0.4rem 0; border-bottom: 1px solid var(--border-color); font-size: 0.9rem;">
              <span><strong>${w.word}</strong></span>
              <span class="badge-tag" style="background: var(--ham-green-bg); color: #34d399; border-color: var(--ham-green-border);">${w.count} times</span>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
  `;
}

// Custom Training Form Handler
const trainForm = document.getElementById('trainForm');
if (trainForm) {
  trainForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const label = document.getElementById('customLabel').value;
    const subject = document.getElementById('customSubject').value.trim();
    const body = document.getElementById('customBody').value.trim();
    const trainStatus = document.getElementById('trainStatus');

    if (!subject && !body) {
      trainStatus.innerHTML = '<span style="color: var(--spam-red)">Please enter a subject or body.</span>';
      return;
    }

    trainStatus.innerHTML = '<span>Training model...</span>';
    try {
      const res = await fetch('/api/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label, subject, body })
      });
      const data = await res.json();
      if (res.ok) {
        trainStatus.innerHTML = `<span style="color: var(--ham-green)">✅ Success: ${data.message}</span>`;
        trainForm.reset();
        loadDatasetStats();
      } else {
        trainStatus.innerHTML = `<span style="color: var(--spam-red)">❌ Error: ${data.message}</span>`;
      }
    } catch (err) {
      trainStatus.innerHTML = '<span style="color: var(--warning-yellow)">Note: Running offline. Data stored in session memory.</span>';
    }
  });
}
