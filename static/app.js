/**
 * Email Spam Filter Frontend Application
 * Fully standalone and API-connected with dual-mode Naive Bayes engine.
 * Works 100% seamlessly whether running via local HTTP server or direct file:/// double-click.
 */

// Stop words set for token filtering (exact match with model.py)
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and',
  'any', 'are', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below',
  'between', 'both', 'but', 'by', 'could', 'did', 'do', 'does', 'doing', 'down',
  'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have', 'having',
  'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i',
  'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most',
  'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or',
  'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same',
  'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through',
  'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when',
  'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your',
  'yours', 'yourself', 'yourselves'
]);

// Master Dataset of 36 Curated Emails
const MASTER_DATASET = [
  {
    "label": "spam",
    "subject": "CONGRATULATIONS! You have won $1,000,000 in the National Lottery!",
    "body": "Dear Winner, You have been selected as the grand prize winner of 1,000,000 dollars in cash. To claim your reward and cash prize, click the urgent link below and verify your bank account details immediately. Free gift card included. Act now before this exclusive offer expires!"
  },
  {
    "label": "spam",
    "subject": "URGENT: Your account security has been compromised. Verify immediately!",
    "body": "Attention Customer: Unusual login attempt detected on your bank account. Your access will be suspended within 24 hours unless you confirm your identity. Click here to reset your password and verify your social security number. Do not ignore this alert."
  },
  {
    "label": "spam",
    "subject": "Exclusive weight loss miracle pill - Lose 30 lbs in 2 weeks guaranteed!",
    "body": "Discover the secret diet doctors do not want you to know! Buy now and receive 50% discount plus free shipping. 100% natural, guaranteed results with no exercise required. Order your trial bottle today while supplies last. Click to shop now!"
  },
  {
    "label": "spam",
    "subject": "Claim your $500 Amazon Gift Card right now!",
    "body": "You were selected in our daily rewards draw! Claim your $500 gift card today. Complete a quick 2-minute survey to qualify. Free entry, instant delivery. Hurry, only 3 cards left in stock for your area!"
  },
  {
    "label": "spam",
    "subject": "Pre-approved Loan Offer: Low Interest Rates with No Credit Check!",
    "body": "Get up to $50,000 deposited in your bank account tomorrow. No collateral, bad credit accepted, zero hidden fees. Fast online approval in 5 minutes. Apply immediately by clicking the link below."
  },
  {
    "label": "spam",
    "subject": "Make $5,000 a week working from home on your phone!",
    "body": "Earn extra passive income online with zero experience. Simple tasks, high payouts, work anytime from home. Join thousands of satisfied members making easy money today. Click here to register your free account."
  },
  {
    "label": "spam",
    "subject": "Hot crypto presale alert: 1000x potential coin launches today!",
    "body": "Do not miss the next Bitcoin! Exclusive presale token offering guaranteed returns. Invest now before public listing. Double your crypto portfolio overnight. Send ETH or BTC to reserve your allocation immediately."
  },
  {
    "label": "spam",
    "subject": "Final Notice: Your package delivery is pending custom clearance fee",
    "body": "Your parcel #US-98214 could not be delivered due to an unpaid shipping fee of $2.99. Click the link to update your shipping address and pay the fee to prevent package destruction. Tracking code inside."
  },
  {
    "label": "spam",
    "subject": "Exclusive VIP Casino Bonus: 200 Free Spins + 500% Deposit Match!",
    "body": "Play the hottest slot games and win real money jackpot! Sign up today and get 200 free spins with no deposit required. Instant withdrawal, 24/7 customer support. Gamble responsibly and win big!"
  },
  {
    "label": "spam",
    "subject": "Cheap luxury watches, Rolex replica 90% off sale",
    "body": "Top quality luxury designer watches, bags, and sunglasses at wholesale prices. Free international express shipping on orders over $100. Best replica watches online. Buy 1 get 1 free offer ends midnight!"
  },
  {
    "label": "spam",
    "subject": "Unclaimed inheritance fund of $10.5 Million USD for you",
    "body": "I am barrister James Watson representing a deceased client with your surname. You are entitled to inherit $10,500,000 USD. Contact me strictly confidentially with your full name, phone number, and passport copy to process the transfer."
  },
  {
    "label": "spam",
    "subject": "Boost your website traffic and Google ranking in 7 days guaranteed!",
    "body": "Rank #1 on Google search results! We offer premium SEO backlinks, domain authority boost, and 100,000 visitors per month for only $49. Increase sales and conversions instantly. Contact our digital marketing team now."
  },
  {
    "label": "spam",
    "subject": "Pharmacy online: Buy generic medicines without prescription",
    "body": "Order prescription medications online discreetly. Lowest prices on pain relief, wellness, and vitality products. No doctor prescription needed. Fast discreet door-to-door delivery worldwide. Shop now and save!"
  },
  {
    "label": "spam",
    "subject": "Refinance your mortgage today and cut payments in half!",
    "body": "Mortgage rates have dropped to historic lows! Lower your monthly payments and save thousands per year. Check your new rate in 60 seconds with no credit check penalty. Click here to see your custom quotes."
  },
  {
    "label": "spam",
    "subject": "You have 1 new voice message from an unknown caller",
    "body": "You received an audio voicemail (0:42 sec) from +1-800-555-0199. To listen to your message and download the transcript, open the attached file or click the secure playback link below."
  },
  {
    "label": "spam",
    "subject": "Special Promotion: Free iPhone 15 Pro Max giveaway entry!",
    "body": "Congratulations subscriber! You have been shortlisted for our yearly mobile smartphone sweepstakes. Claim your free brand new iPhone today. Click the link, fill in your postal mailing address and claim your free reward."
  },
  {
    "label": "spam",
    "subject": "Urgent Action: Wire transfer failed - update billing information",
    "body": "Your recent payment of $899.99 could not be processed. Your billing account has been temporarily restricted. Please update your credit card details immediately to avoid cancellation of all active subscriptions."
  },
  {
    "label": "spam",
    "subject": "Become a certified millionaire with our automated trading robot",
    "body": "Generate $2,500 daily on autopilot using advanced AI trading algorithms. Zero technical knowledge required. Guaranteed daily profits directly to your bank account. Download the software free now!"
  },
  {
    "label": "ham",
    "subject": "Project Status Update: Q3 Sprint Review and Timeline",
    "body": "Hi team, please find attached the slide deck for our upcoming Q3 sprint review scheduled for Thursday at 2:00 PM. We have completed 85% of our milestones, including the API migration and user authentication overhaul. Please review the blocker list before our meeting."
  },
  {
    "label": "ham",
    "subject": "Quarterly Performance Review and 1-on-1 Feedback",
    "body": "Hi Sarah, let us schedule our quarterly performance review for next Tuesday at 10 AM. Please fill out the self-evaluation form on Workday by Friday afternoon. Looking forward to discussing your achievements and goals for the coming quarter."
  },
  {
    "label": "ham",
    "subject": "Your Order Confirmation - Invoice #847291",
    "body": "Thank you for your order with TechStore! Your order #847291 for the Mechanical Keyboard and USB-C Cable has been received and is being prepared for dispatch. Estimated delivery date is Monday, September 4th. You can view your invoice attached."
  },
  {
    "label": "ham",
    "subject": "Meeting Agenda: Weekly Engineering Sync & Architecture Discussion",
    "body": "Hello everyone, here is the agenda for tomorrow engineering sync: 1. Review PR backlog, 2. Database indexing performance improvements, 3. Microservice deprecation timeline. Let me know if you have additional topics to add."
  },
  {
    "label": "ham",
    "subject": "Doctor Appointment Reminder - Dr. Emily Henderson",
    "body": "This is a reminder for your upcoming dental cleaning appointment with Dr. Henderson on Wednesday, September 6 at 11:30 AM. If you need to reschedule or cancel your visit, please call the clinic office at least 24 hours in advance."
  },
  {
    "label": "ham",
    "subject": "Lunch tomorrow at 12:30 PM?",
    "body": "Hey Alex, are you free to grab lunch tomorrow around 12:30? A new Mediterranean place opened down the street from the office and wanted to check it out. Let me know if that time works for you!"
  },
  {
    "label": "ham",
    "subject": "Flight Itinerary and Boarding Pass for Flight AA 1402",
    "body": "Your flight from San Francisco (SFO) to New York (JFK) is confirmed. Departure is scheduled for Friday at 8:15 AM from Terminal 2, Gate 42. Check-in is now open online. Please review luggage policies and boarding requirements."
  },
  {
    "label": "ham",
    "subject": "Code Review Request: Add Naive Bayes Classifier model tests",
    "body": "Hi Michael, I just pushed branch feature/naive-bayes-tests to GitHub. It adds unit tests for tokenizer edge cases, smoothing parameters, and edge cases with empty strings. Could you please take a look and approve the pull request when you have time?"
  },
  {
    "label": "ham",
    "subject": "Monthly Electricity and Utility Bill Notification",
    "body": "Your electric utility statement for the period of August 1 to August 31 is now ready to view. Total amount due is $74.20, scheduled for automatic deduction on September 15. Log in to your portal account to view the detailed breakdown."
  },
  {
    "label": "ham",
    "subject": "Campus Library: Book Due Date Reminder",
    "body": "Dear Student, the following book borrowed from University Library is due in 3 days: Introduction to Machine Learning, 4th Edition. If you wish to renew your loan, please log in to the library portal or return the book to the circulation desk."
  },
  {
    "label": "ham",
    "subject": "Notes from today client onboarding session",
    "body": "Hi team, thanks for joining the onboarding kickoff with Acme Corp. Key takeaways: their primary goal is streamlining data ingestion, integration target is end of October, and our next milestone checkpoint is next Wednesday at 3 PM."
  },
  {
    "label": "ham",
    "subject": "Weekend hiking trip plan and gear checklist",
    "body": "Hey guys, for Saturday hike in the mountains, let us meet at the trailhead parking lot at 7:00 AM sharp to beat the heat. Make sure to bring at least 3 liters of water, snacks, trail shoes, and sun protection. Looking forward to it!"
  },
  {
    "label": "ham",
    "subject": "Invitation: Python Machine Learning Workshop (Online)",
    "body": "You are invited to participate in our hands-on workshop on Natural Language Processing and Classification algorithms on Thursday from 5:00 to 7:00 PM. Link to join the Google Meet room has been added to your calendar invite."
  },
  {
    "label": "ham",
    "subject": "Annual Parent-Teacher Conference Schedule",
    "body": "Dear Parents, Fall conferences will take place on October 12th and 13th. Please select a 15-minute conference slot using the booking portal link to discuss your child academic progress and social development."
  },
  {
    "label": "ham",
    "subject": "Gym Membership Renewal & Class Schedule Update",
    "body": "Hi Daniel, your monthly fitness membership has renewed successfully. Check out our new yoga, spinning, and HIIT class schedules starting this Monday. Locker room maintenance is scheduled for Sunday morning."
  },
  {
    "label": "ham",
    "subject": "Research Paper Draft: Naive Bayes in NLP Applications",
    "body": "Attached is the revised draft of our research paper comparing Multinomial Naive Bayes with Support Vector Machines on text classification tasks. Please review Section 3 for statistical accuracy and send comments by Friday."
  },
  {
    "label": "ham",
    "subject": "Apartment Lease Renewal Agreement for 2026-2027",
    "body": "Dear Resident, your current apartment lease will expire on October 31. If you plan to renew for another 12 months at the current rate, please sign the attached digital lease addendum by the end of this month."
  },
  {
    "label": "ham",
    "subject": "Team Standup Notes and Action Items - Tuesday",
    "body": "Good morning everyone! Quick recap of today standup: backend team is finishing API auth tests, frontend team is polishing the responsive navigation bar, and QA will begin end-to-end regression testing on Wednesday."
  }
];

/**
 * Pure JavaScript Multinomial Naive Bayes Classifier
 * Exact parity with model.py (Laplace smoothing alpha=1.0, log-space arithmetic)
 */
class ClientNaiveBayes {
  constructor(alpha = 1.0) {
    this.alpha = alpha;
    this.classes = ['ham', 'spam'];
    this.classCounts = { ham: 0, spam: 0 };
    this.wordCounts = { ham: {}, spam: {} };
    this.totalWords = { ham: 0, spam: 0 };
    this.vocab = new Set();
    this.classPriors = { ham: 0.5, spam: 0.5 };
    this.totalSamples = 0;
    this.isTrained = false;
  }

  tokenize(text) {
    if (!text || typeof text !== 'string') return [];
    let clean = text.toLowerCase();
    clean = clean.replace(/\$[0-9,]+(?:\.[0-9]{2})?/g, ' __currency__ ');
    clean = clean.replace(/!{2,}/g, ' __exclamations__ ');
    clean = clean.replace(/\?{2,}/g, ' __questions__ ');
    const tokens = clean.match(/\b[a-z0-9_]{2,}\b|__[a-z]+__/g) || [];
    return tokens.filter(t => !STOP_WORDS.has(t));
  }

  fit(dataset) {
    this.classCounts = { ham: 0, spam: 0 };
    this.wordCounts = { ham: {}, spam: {} };
    this.totalWords = { ham: 0, spam: 0 };
    this.vocab = new Set();
    this.totalSamples = dataset.length;

    dataset.forEach(item => {
      const label = item.label.toLowerCase();
      if (!this.classes.includes(label)) return;
      this.classCounts[label]++;
      const text = (item.subject || '') + ' ' + (item.body || '');
      const tokens = this.tokenize(text);
      tokens.forEach(tok => {
        this.wordCounts[label][tok] = (this.wordCounts[label][tok] || 0) + 1;
        this.totalWords[label]++;
        this.vocab.add(tok);
      });
    });

    this.classes.forEach(c => {
      this.classPriors[c] = this.totalSamples > 0 ? this.classCounts[c] / this.totalSamples : 0.5;
    });

    this.isTrained = true;
    return this;
  }

  wordLikelihood(word, label) {
    const vocabSize = this.vocab.size;
    const count = this.wordCounts[label][word] || 0;
    const total = this.totalWords[label];
    const denom = total + this.alpha * vocabSize;
    return denom > 0 ? (count + this.alpha) / denom : 1.0;
  }

  explain(text) {
    const tokens = this.tokenize(text);
    const logProbs = {};

    this.classes.forEach(c => {
      const prior = this.classPriors[c] > 0 ? this.classPriors[c] : 1e-10;
      let sum = Math.log(prior);
      tokens.forEach(tok => {
        sum += Math.log(this.wordLikelihood(tok, c));
      });
      logProbs[c] = sum;
    });

    const maxLog = Math.max(logProbs.ham, logProbs.spam);
    const expHam = Math.exp(logProbs.ham - maxLog);
    const expSpam = Math.exp(logProbs.spam - maxLog);
    const totalExp = expHam + expSpam;

    const probSpam = totalExp > 0 ? expSpam / totalExp : 0.5;
    const probHam = totalExp > 0 ? expHam / totalExp : 0.5;

    const tokenAnalysis = tokens.map(tok => {
      const pSpam = this.wordLikelihood(tok, 'spam');
      const pHam = this.wordLikelihood(tok, 'ham');
      const logRatio = Math.log(pSpam / pHam);
      return {
        token: tok,
        spam_likelihood: parseFloat(pSpam.toFixed(6)),
        ham_likelihood: parseFloat(pHam.toFixed(6)),
        log_odds: parseFloat(logRatio.toFixed(4)),
        influence: logRatio > 0.4 ? 'spam' : (logRatio < -0.4 ? 'ham' : 'neutral'),
        weight: parseFloat(Math.abs(logRatio).toFixed(3))
      };
    });

    const topSpamTriggers = [...tokenAnalysis].filter(t => t.log_odds > 0).sort((a, b) => b.log_odds - a.log_odds).slice(0, 6);
    const topHamTriggers = [...tokenAnalysis].filter(t => t.log_odds < 0).sort((a, b) => a.log_odds - b.log_odds).slice(0, 6);

    const isSpam = probSpam >= 0.5;
    const confidence = isSpam ? probSpam : probHam;

    return {
      predicted_class: isSpam ? 'spam' : 'ham',
      is_spam: isSpam,
      confidence: parseFloat((confidence * 100).toFixed(2)),
      spam_probability: parseFloat((probSpam * 100).toFixed(2)),
      ham_probability: parseFloat((probHam * 100).toFixed(2)),
      tokens_analyzed: tokens.length,
      token_details: tokenAnalysis,
      top_spam_triggers: topSpamTriggers,
      top_ham_triggers: topHamTriggers,
      priors: {
        spam: parseFloat(this.classPriors.spam.toFixed(4)),
        ham: parseFloat(this.classPriors.ham.toFixed(4))
      }
    };
  }

  getVocabularyList() {
    const list = [];
    this.vocab.forEach(word => {
      const sc = this.wordCounts.spam[word] || 0;
      const hc = this.wordCounts.ham[word] || 0;
      const pSpam = this.wordLikelihood(word, 'spam');
      const pHam = this.wordLikelihood(word, 'ham');
      const logRatio = Math.log(pSpam / pHam);
      list.push({
        word: word,
        spam_count: sc,
        ham_count: hc,
        total_count: sc + hc,
        spam_prob: pSpam,
        ham_prob: pHam,
        log_odds: parseFloat(logRatio.toFixed(4)),
        influence: logRatio > 0.4 ? 'spam' : (logRatio < -0.4 ? 'ham' : 'neutral')
      });
    });
    list.sort((a, b) => (b.total_count - a.total_count) || (Math.abs(b.log_odds) - Math.abs(a.log_odds)));
    return list;
  }
}

// Global Engine Instance
const clientNB = new ClientNaiveBayes(1.0);
clientNB.fit(MASTER_DATASET);

// State
let allDatasetEmails = [...MASTER_DATASET];
let allVocabItems = clientNB.getVocabularyList();
let filteredDataset = [...allDatasetEmails];
let filteredVocab = [...allVocabItems];
let currentCategoryFilter = 'all';
let currentVocabFilter = 'all';
let liveDebounceTimer = null;
let isServerOnline = false;

// DOM Elements
const subjectInput = document.getElementById('emailSubject');
const bodyInput = document.getElementById('emailBody');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
const sampleChipsContainer = document.getElementById('sampleChips');
const resultCard = document.getElementById('resultCard');
const themeToggle = document.getElementById('themeToggle');

// Navigation Tabs
document.querySelectorAll('.tabs-nav .tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tabs-nav .tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.getAttribute('data-tab');
    const targetPanel = document.getElementById(target);
    if (targetPanel) targetPanel.classList.add('active');
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

// Sub-View Switcher inside Dataset tab
window.switchDatasetSubView = function(view) {
  document.querySelectorAll('.sub-nav .sub-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('subViewDataset').style.display = 'none';
  document.getElementById('subViewVocab').style.display = 'none';
  document.getElementById('subViewMatrix').style.display = 'none';

  if (view === 'dataset') {
    document.getElementById('subBtnDataset').classList.add('active');
    document.getElementById('subViewDataset').style.display = 'block';
  } else if (view === 'vocab') {
    document.getElementById('subBtnVocab').classList.add('active');
    document.getElementById('subViewVocab').style.display = 'block';
  } else if (view === 'matrix') {
    document.getElementById('subBtnMatrix').classList.add('active');
    document.getElementById('subViewMatrix').style.display = 'block';
  }
};

// Initialize Application on Page Load
window.addEventListener('DOMContentLoaded', async () => {
  renderSampleChips(MASTER_DATASET.slice(0, 6).map(d => ({
    title: d.label === 'spam' ? `💰 ${d.subject.slice(0, 24)}...` : `📝 ${d.subject.slice(0, 24)}...`,
    category: d.label,
    subject: d.subject,
    body: d.body
  })));

  await syncWithServer();
  renderDatasetCards();
  renderVocabTable();

  // Load first sample and run classification
  loadEmailIntoClassifier(MASTER_DATASET[0].subject, MASTER_DATASET[0].body);
  analyzeEmail();
});

// Server Sync
async function syncWithServer() {
  try {
    const res = await fetch('/api/stats', { signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      isServerOnline = true;
      const stats = await res.json();
      document.getElementById('statTotalSamples').innerText = stats.total_samples;
      document.getElementById('statVocabSize').innerText = stats.vocab_size;
      document.getElementById('statClassSplit').innerText = `${stats.class_counts.ham} / ${stats.class_counts.spam}`;

      // Load dataset & vocabulary from server
      const [dRes, vRes] = await Promise.all([
        fetch('/api/dataset'),
        fetch('/api/vocabulary')
      ]);
      if (dRes.ok) {
        const dJson = await dRes.json();
        if (dJson.dataset && dJson.dataset.length > 0) {
          allDatasetEmails = dJson.dataset;
          clientNB.fit(allDatasetEmails);
        }
      }
      if (vRes.ok) {
        const vJson = await vRes.json();
        if (vJson.vocabulary && vJson.vocabulary.length > 0) {
          allVocabItems = vJson.vocabulary;
        }
      }
    }
  } catch (e) {
    isServerOnline = false;
    document.getElementById('statTotalSamples').innerText = allDatasetEmails.length;
    document.getElementById('statVocabSize').innerText = allVocabItems.length;
  }

  filteredDataset = [...allDatasetEmails];
  filteredVocab = [...allVocabItems];
}

// Render Dataset Cards
function renderDatasetCards() {
  const container = document.getElementById('datasetCardsContainer');
  if (!container) return;

  if (filteredDataset.length === 0) {
    container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-muted);">No matching emails found.</div>';
    return;
  }

  container.innerHTML = filteredDataset.map((item, idx) => {
    const isSpam = item.label === 'spam';
    const wordCount = (item.subject + ' ' + item.body).split(/\s+/).length;
    return `
      <div class="email-card ${isSpam ? 'spam' : 'ham'}">
        <div>
          <div class="email-card-header">
            <span class="trigger-badge ${isSpam ? 'spam' : 'ham'}">
              ${isSpam ? '🚨 SPAM' : '✅ HAM'}
            </span>
            <span style="font-size: 0.75rem; color: var(--text-faint);">#${idx + 1} &bull; ${wordCount} words</span>
          </div>
          <div class="email-card-subject">${escapeHtml(item.subject)}</div>
          <div class="email-card-body">${escapeHtml(item.body)}</div>
        </div>
        <div class="email-card-footer">
          <span>Click to classify:</span>
          <button class="btn btn-primary btn-sm" onclick="testDatasetEmail(${idx})">
            ⚡ Test Email
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Render Vocabulary Table
function renderVocabTable() {
  const tbody = document.getElementById('vocabTableBody');
  if (!tbody) return;

  if (filteredVocab.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">No vocabulary words matching search.</td></tr>';
    return;
  }

  tbody.innerHTML = filteredVocab.slice(0, 150).map(v => {
    return `
      <tr>
        <td><strong>${v.word === '__currency__' ? '💲 Currency' : escapeHtml(v.word)}</strong></td>
        <td style="color: var(--spam-red); font-weight: 600;">${v.spam_count}</td>
        <td style="color: var(--ham-green); font-weight: 600;">${v.ham_count}</td>
        <td>${v.spam_prob.toFixed(5)}</td>
        <td>${v.ham_prob.toFixed(5)}</td>
        <td style="font-weight: 700; color: ${v.log_odds > 0 ? '#f87171' : (v.log_odds < 0 ? '#34d399' : 'var(--text-muted)')};">
          ${v.log_odds > 0 ? '+' : ''}${v.log_odds}
        </td>
        <td>
          <span class="trigger-badge ${v.influence}" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">
            ${v.influence.toUpperCase()}
          </span>
        </td>
      </tr>
    `;
  }).join('');
}

// Search & Filter Dataset
const datasetSearch = document.getElementById('datasetSearchInput');
if (datasetSearch) {
  datasetSearch.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    filterDataset(q, currentCategoryFilter);
  });
}

window.filterDatasetCategory = function(cat, btn) {
  document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  currentCategoryFilter = cat;
  const q = datasetSearch ? datasetSearch.value.toLowerCase().trim() : '';
  filterDataset(q, cat);
};

function filterDataset(query, category) {
  filteredDataset = allDatasetEmails.filter(item => {
    const matchCat = (category === 'all') || (item.label === category);
    const matchText = !query || item.subject.toLowerCase().includes(query) || item.body.toLowerCase().includes(query);
    return matchCat && matchText;
  });
  renderDatasetCards();
}

// Search & Filter Vocabulary
const vocabSearch = document.getElementById('vocabSearchInput');
if (vocabSearch) {
  vocabSearch.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    filterVocab(q, currentVocabFilter);
  });
}

window.filterVocabType = function(type, btn) {
  document.querySelectorAll('.vocab-pill').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  currentVocabFilter = type;
  const q = vocabSearch ? vocabSearch.value.toLowerCase().trim() : '';
  filterVocab(q, type);
};

function filterVocab(query, type) {
  filteredVocab = allVocabItems.filter(v => {
    const matchType = (type === 'all') || (v.influence === type);
    const matchText = !query || v.word.toLowerCase().includes(query);
    return matchType && matchText;
  });
  renderVocabTable();
}

// Test email from dataset
window.testDatasetEmail = function(idx) {
  const item = filteredDataset[idx];
  if (!item) return;

  loadEmailIntoClassifier(item.subject, item.body);

  // Switch to Classifier Tab
  document.querySelectorAll('.tabs-nav .tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  const firstTabBtn = document.querySelector('.tabs-nav .tab-btn[data-tab="tab-analyzer"]');
  if (firstTabBtn) firstTabBtn.classList.add('active');
  const firstPanel = document.getElementById('tab-analyzer');
  if (firstPanel) firstPanel.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
  analyzeEmail();
};

function loadEmailIntoClassifier(subject, body) {
  subjectInput.value = subject || '';
  bodyInput.value = body || '';
}

function renderSampleChips(samples) {
  sampleChipsContainer.innerHTML = '';
  samples.forEach(sample => {
    const chip = document.createElement('button');
    chip.className = `sample-chip ${sample.category === 'spam' ? 'spam-chip' : 'ham-chip'}`;
    chip.innerHTML = `${sample.title}`;
    chip.addEventListener('click', () => {
      loadEmailIntoClassifier(sample.subject, sample.body);
      analyzeEmail();
    });
    sampleChipsContainer.appendChild(chip);
  });
}

// Clear Inputs
clearBtn.addEventListener('click', () => {
  subjectInput.value = '';
  bodyInput.value = '';
  renderEmptyResult();
});

// Live Typing Debouncer
[subjectInput, bodyInput].forEach(el => {
  el.addEventListener('input', () => {
    clearTimeout(liveDebounceTimer);
    liveDebounceTimer = setTimeout(() => {
      if (subjectInput.value.trim() || bodyInput.value.trim()) {
        analyzeEmail();
      } else {
        renderEmptyResult();
      }
    }, 250);
  });
});

analyzeBtn.addEventListener('click', analyzeEmail);

// Analysis Action
async function analyzeEmail() {
  const subject = subjectInput.value.trim();
  const body = bodyInput.value.trim();
  const fullText = (subject + ' ' + body).trim();

  if (!fullText) {
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
      const localResult = clientNB.explain(fullText);
      renderResult(localResult);
    }
  } catch (e) {
    // Immediate fallback to local high-precision JavaScript Naive Bayes
    const localResult = clientNB.explain(fullText);
    renderResult(localResult);
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
          <span style="color: var(--ham-green); font-weight: 700;">Ham: ${result.ham_probability}%</span>
          <span style="color: var(--spam-red); font-weight: 700;">Spam: ${result.spam_probability}%</span>
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
                ${t.token === '__currency__' ? '💲 Currency' : escapeHtml(t.token)} 
                <small>(${t.log_odds > 0 ? '+' : ''}${t.log_odds})</small>
              </span>
            `).join('')
          : '<span style="color: var(--text-muted); font-size: 0.85rem">No strong trigger words detected. Class balance determined outcome.</span>'
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
              <td><strong>${t.token === '__currency__' ? '💲 Currency' : escapeHtml(t.token)}</strong></td>
              <td>${t.spam_likelihood.toFixed(5)}</td>
              <td>${t.ham_likelihood.toFixed(5)}</td>
              <td style="font-weight: 700; color: ${t.log_odds > 0 ? '#f87171' : (t.log_odds < 0 ? '#34d399' : 'var(--text-muted)')};">
                ${t.log_odds > 0 ? '+' : ''}${t.log_odds}
              </td>
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
      <strong>📐 Bayes Theorem Step-by-Step:</strong>
      <div class="math-formula">
        log P(Spam|W) = log(0.5) + ∑ log P(wᵢ|Spam)
        <br>
        log P(Ham|W)  = log(0.5) + ∑ log P(wᵢ|Ham)
      </div>
      <p style="font-size: 0.8rem; color: var(--text-muted);">
        Computed using Laplace smoothing (α=1.0) and log-sum-exp normalization.
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
    const newEntry = { label, subject, body };

    try {
      const res = await fetch('/api/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry)
      });
      const data = await res.json();
      if (res.ok) {
        trainStatus.innerHTML = `<span style="color: var(--ham-green)">✅ Success: ${data.message}</span>`;
      } else {
        trainStatus.innerHTML = `<span style="color: var(--spam-red)">❌ Error: ${data.message}</span>`;
      }
    } catch (err) {
      trainStatus.innerHTML = '<span style="color: var(--ham-green)">✅ Added and retrained in local engine!</span>';
    }

    allDatasetEmails.push(newEntry);
    clientNB.fit(allDatasetEmails);
    allVocabItems = clientNB.getVocabularyList();
    filteredDataset = [...allDatasetEmails];
    filteredVocab = [...allVocabItems];

    document.getElementById('statTotalSamples').innerText = allDatasetEmails.length;
    document.getElementById('statVocabSize').innerText = allVocabItems.length;
    renderDatasetCards();
    renderVocabTable();
    trainForm.reset();
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, function(m) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    })[m];
  });
}

const emailFile = document.getElementById("emailFile");

if (emailFile) {
    emailFile.addEventListener("change", function () {
        const file = this.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (event) {
            const fileContent = event.target.result;

            document.getElementById("emailBody").value = fileContent;

            alert("File uploaded successfully: " + file.name);
        };

        reader.readAsText(file);
    });
}

// ==========================================
// UPLOAD EMAIL FILE
// ==========================================

const emailFileInput = document.getElementById("emailFile");

if (emailFileInput) {

    emailFileInput.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (event) {

            // Put uploaded file content into email body
            const emailBody = document.getElementById("emailBody");

            if (emailBody) {
                emailBody.value = event.target.result;
            }

            // Show uploaded file name in subject
            const emailSubject = document.getElementById("emailSubject");

            if (emailSubject && emailSubject.value.trim() === "") {
                emailSubject.value = file.name;
            }

            alert("✅ File uploaded successfully! Now click Analyze Email.");
        };

        reader.onerror = function () {
            alert("❌ Unable to read this file.");
        };

        reader.readAsText(file);
    });
}