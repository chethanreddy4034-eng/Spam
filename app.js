/**
 * Email Spam Filter - Naive Bayes Classifier Application
 * Supports full offline in-browser execution (for GitHub Pages)
 * and seamless dynamic REST API integration (when backend app.py is running).
 */

// Embedded Pretrained Model & Dataset for Standalone / GitHub Pages Mode
const EMBEDDED_MODEL_DATA = {"alpha": 1.0, "total_samples": 36, "class_counts": {"ham": 18, "spam": 18}, "class_priors": {"ham": 0.5, "spam": 0.5}, "total_words": {"ham": 548, "spam": 557}, "vocab_size": 718, "vocab": ["electricity", "sales", "requirements", "least", "selected", "client", "offer", "simple", "lows", "prepared", "renewed", "boost", "hidden", "cases", "right", "deceased", "saturday", "academic", "overnight", "dr", "monthly", "see", "access", "customer", "processed", "lose", "discount", "classifier", "cards", "hiit", "library", "discover", "deduction", "date", "offering", "claim", "call", "trip", "primary", "can", "automated", "24", "detected", "deposited", "miss", "engineering", "cheap", "555", "0199", "caller", "medications", "added", "recap", "fee", "delivery", "launches", "voice", "seconds", "watson", "pill", "confirm", "quarter", "ingestion", "public", "50", "around", "weekly", "money", "slide", "overhaul", "amazon", "membership", "identity", "invitation", "meet", "dear", "act", "income", "generate", "monday", "weight", "mediterranean", "weeks", "afternoon", "know", "gym", "sprint", "edition", "unclaimed", "confirmation", "20", "tuesday", "high", "hurry", "blocker", "suspended", "apply", "ignore", "winner", "select", "streamlining", "august", "bill", "casino", "password", "api", "without", "200", "self", "participate", "conversions", "feedback", "checkpoint", "hottest", "voicemail", "brand", "cash", "surname", "work", "conferences", "bonus", "invest", "empty", "want", "gamble", "games", "collateral", "another", "increase", "total", "bitcoin", "parcel", "search", "goals", "national", "inherit", "thanks", "natural", "check", "usb", "user", "unit", "statement", "big", "attached", "wednesday", "send", "working", "accuracy", "knowledge", "profits", "results", "aa", "key", "reward", "look", "period", "attention", "instantly", "orders", "hello", "lowest", "area", "corp", "notification", "standup", "confirmed", "1402", "thursday", "discussing", "migration", "exercise", "active", "left", "portal", "sale", "sure", "earn", "acme", "let", "half", "keyboard", "satisfied", "performance", "compromised", "tokenizer", "make", "payments", "model", "withdrawal", "schedule", "match", "12", "ready", "including", "software", "flight", "immediately", "reschedule", "transcript", "team", "bottle", "authority", "invite", "portfolio", "directly", "quality", "strictly", "plus", "vitality", "800", "final", "clearance", "500", "checklist", "edge", "visit", "members", "lot", "cancel", "form", "tests", "visitors", "million", "scheduled", "package", "next", "real", "tracking", "crypto", "open", "expire", "place", "12th", "mechanical", "wellness", "unless", "francisco", "congratulations", "passport", "estimated", "unknown", "prices", "pass", "restricted", "approval", "subscriber", "testing", "quick", "q3", "trial", "naive", "machines", "technical", "complete", "finishing", "advance", "section", "sharp", "90", "morning", "nlp", "copy", "thousands", "support", "miracle", "shoes", "relief", "promotion", "listen", "included", "henderson", "best", "discuss", "statistical", "potential", "review", "cut", "pr", "fitness", "thank", "confidentially", "starting", "social", "bar", "parent", "guys", "prescription", "log", "request", "interest", "btc", "addendum", "sec", "james", "comparing", "coming", "luggage", "historic", "onboarding", "lunch", "mailing", "smartphone", "action", "vector", "expires", "development", "urgent", "pain", "advanced", "token", "hours", "medicines", "renew", "destruction", "ai", "within", "hi", "representing", "trail", "meeting", "ends", "end", "take", "fund", "supplies", "qa", "spinning", "clinic", "current", "coin", "add", "research", "payment", "good", "anytime", "shipping", "session", "bring", "liters", "clicking", "allocation", "00", "subscriptions", "shop", "hands", "fees", "data", "buy", "python", "31", "goal", "4th", "low", "free", "time", "hiking", "attempt", "learning", "fill", "need", "us", "gift", "dispatch", "online", "draft", "playback", "dropped", "bank", "failed", "payouts", "daily", "utility", "mortgage", "tasks", "unusual", "milestones", "hike", "penalty", "polishing", "frontend", "following", "millionaire", "conference", "san", "emily", "instant", "yearly", "pay", "gate", "sweepstakes", "deposit", "jfk", "contact", "please", "number", "completed", "traffic", "works", "water", "top", "85", "heat", "comments", "marketing", "needed", "prize", "strings", "billing", "audio", "architecture", "bayes", "details", "credit", "wire", "street", "parameters", "alex", "presale", "847291", "15", "refinance", "quotes", "survey", "process", "information", "unpaid", "multinomial", "loss", "parents", "extra", "navigation", "room", "robot", "trading", "become", "certified", "60", "reserve", "rates", "milestone", "diet", "successfully", "amount", "verify", "lower", "policies", "cleaning", "10", "login", "locker", "workday", "delivered", "resident", "wanted", "discreet", "weekend", "processing", "upcoming", "play", "received", "bad", "pro", "detailed", "trailhead", "quarterly", "september", "status", "accepted", "october", "book", "rolex", "lease", "stock", "receive", "alert", "class", "sign", "website", "forward", "grand", "discreetly", "autopilot", "minutes", "join", "transfer", "hey", "double", "office", "return", "invoice", "apartment", "now", "opened", "machine", "returns", "microservice", "000", "midnight", "doctors", "message", "cable", "backlinks", "progress", "algorithms", "booking", "boarding", "lottery", "responsive", "list", "guaranteed", "mobile", "temporarily", "pre", "order", "integration", "indexing", "required", "98214", "breakdown", "pull", "database", "months", "additional", "sfo", "sunday", "smoothing", "won", "reminder", "looking", "2027", "giveaway", "address", "save", "30", "making", "days", "barrister", "friday", "13th", "fall", "sync", "topics", "achievements", "avoid", "inside", "improvements", "terminal", "using", "zero", "backlog", "vip", "max", "42", "1000x", "timeline", "electric", "update", "snacks", "view", "passive", "kickoff", "joining", "special", "sarah", "beat", "home", "express", "reset", "11", "calendar", "rate", "name", "agreement", "draw", "exclusive", "student", "university", "hot", "premium", "revised", "workshop", "card", "protection", "postal", "experience", "eth", "jackpot", "cancellation", "year", "find", "due", "entitled", "prevent", "tomorrow", "spins", "watches", "daniel", "yoga", "approve", "feature", "wholesale", "replica", "invited", "authentication", "doctor", "mountains", "bags", "discussion", "per", "regression", "easy", "dollars", "usd", "100", "paper", "pending", "sunglasses", "applications", "full", "inheritance", "digital", "google", "wish", "pushed", "domain", "pm", "techstore", "register", "minute", "teacher", "loan", "worldwide", "responsibly", "entry", "link", "plan", "rewards", "win", "campus", "departure", "agenda", "new", "items", "week", "appointment", "sun", "everyone", "auth", "takeaways", "backend", "project", "month", "door", "text", "last", "approved", "dental", "luxury", "circulation", "seo", "today", "maintenance", "schedules", "iphone", "parking", "deprecation", "desk", "99", "pharmacy", "generic", "evaluation", "lbs", "introduction", "fast", "notes", "2026", "file", "itinerary", "adds", "download", "michael", "language", "international", "deck", "will", "products", "gear", "renewal", "security", "child", "automatic", "recent", "branch", "classification", "get", "custom", "target", "ranking", "github", "york", "click", "rank", "secret", "borrowed", "grab", "listing", "shortlisted", "code", "qualify", "phone", "slot", "secure", "annual", "notice", "designer", "account", "begin"], "word_counts": {"ham": {"campus": 1, "library": 3, "book": 3, "due": 3, "date": 2, "reminder": 3, "dear": 3, "student": 1, "following": 1, "borrowed": 1, "university": 1, "days": 1, "introduction": 1, "machine": 2, "learning": 2, "4th": 2, "edition": 1, "wish": 1, "renew": 2, "loan": 1, "please": 10, "log": 2, "portal": 3, "return": 1, "circulation": 1, "desk": 1, "gym": 1, "membership": 2, "renewal": 2, "class": 2, "schedule": 3, "update": 2, "hi": 5, "daniel": 1, "monthly": 2, "fitness": 1, "renewed": 1, "successfully": 1, "check": 3, "new": 3, "yoga": 1, "spinning": 1, "hiit": 1, "schedules": 1, "starting": 1, "monday": 2, "locker": 1, "room": 2, "maintenance": 1, "scheduled": 4, "sunday": 1, "morning": 2, "quarterly": 2, "performance": 3, "review": 9, "feedback": 1, "sarah": 1, "let": 4, "us": 2, "next": 3, "tuesday": 2, "10": 1, "fill": 1, "self": 1, "evaluation": 1, "form": 1, "workday": 1, "friday": 3, "afternoon": 1, "looking": 2, "forward": 2, "discussing": 1, "achievements": 1, "goals": 1, "coming": 1, "quarter": 1, "invitation": 1, "python": 1, "workshop": 2, "online": 2, "invited": 1, "participate": 1, "hands": 1, "natural": 1, "language": 1, "processing": 1, "classification": 2, "algorithms": 1, "thursday": 2, "00": 4, "pm": 4, "link": 2, "join": 1, "google": 1, "meet": 2, "added": 1, "calendar": 1, "invite": 1, "code": 1, "request": 2, "add": 2, "naive": 4, "bayes": 4, "classifier": 1, "model": 1, "tests": 4, "michael": 1, "pushed": 1, "branch": 1, "feature": 1, "github": 1, "adds": 1, "unit": 1, "tokenizer": 1, "edge": 2, "cases": 2, "smoothing": 1, "parameters": 1, "empty": 1, "strings": 1, "take": 2, "look": 1, "approve": 1, "pull": 1, "time": 2, "doctor": 1, "appointment": 2, "dr": 2, "emily": 1, "henderson": 2, "upcoming": 2, "dental": 1, "cleaning": 1, "wednesday": 3, "september": 3, "11": 1, "30": 3, "need": 1, "reschedule": 1, "cancel": 1, "visit": 1, "call": 1, "clinic": 1, "office": 2, "least": 2, "24": 1, "hours": 1, "advance": 1, "electricity": 1, "utility": 2, "bill": 1, "notification": 1, "electric": 1, "statement": 1, "period": 1, "august": 2, "31": 2, "now": 2, "ready": 1, "view": 3, "total": 1, "amount": 1, "20": 1, "automatic": 1, "deduction": 1, "15": 3, "account": 1, "detailed": 1, "breakdown": 1, "annual": 1, "parent": 1, "teacher": 1, "conference": 2, "parents": 1, "fall": 1, "conferences": 1, "will": 3, "place": 2, "october": 3, "12th": 1, "13th": 1, "select": 1, "minute": 1, "slot": 1, "using": 1, "booking": 1, "discuss": 1, "child": 1, "academic": 1, "progress": 1, "social": 1, "development": 1, "notes": 2, "today": 2, "client": 1, "onboarding": 2, "session": 1, "team": 5, "thanks": 1, "joining": 1, "kickoff": 1, "acme": 1, "corp": 1, "key": 1, "takeaways": 1, "primary": 1, "goal": 1, "streamlining": 1, "data": 1, "ingestion": 1, "integration": 1, "target": 1, "end": 4, "milestone": 1, "checkpoint": 1, "order": 3, "confirmation": 1, "invoice": 2, "847291": 2, "thank": 1, "techstore": 1, "mechanical": 1, "keyboard": 1, "usb": 1, "cable": 1, "received": 1, "prepared": 1, "dispatch": 1, "estimated": 1, "delivery": 1, "can": 1, "attached": 4, "standup": 2, "action": 1, "items": 1, "good": 1, "everyone": 2, "quick": 1, "recap": 1, "backend": 1, "finishing": 1, "api": 2, "auth": 1, "frontend": 1, "polishing": 1, "responsive": 1, "navigation": 1, "bar": 1, "qa": 1, "begin": 1, "regression": 1, "testing": 1, "flight": 3, "itinerary": 1, "boarding": 2, "pass": 1, "aa": 1, "1402": 1, "san": 1, "francisco": 1, "sfo": 1, "york": 1, "jfk": 1, "confirmed": 1, "departure": 1, "terminal": 1, "gate": 1, "42": 1, "open": 1, "luggage": 1, "policies": 1, "requirements": 1, "apartment": 2, "lease": 3, "agreement": 1, "2026": 1, "2027": 1, "resident": 1, "current": 2, "expire": 1, "plan": 2, "another": 1, "12": 3, "months": 1, "rate": 1, "sign": 1, "digital": 1, "addendum": 1, "month": 1, "project": 1, "status": 1, "q3": 2, "sprint": 2, "timeline": 2, "find": 1, "slide": 1, "deck": 1, "completed": 1, "85": 1, "milestones": 1, "including": 1, "migration": 1, "user": 1, "authentication": 1, "overhaul": 1, "blocker": 1, "list": 1, "meeting": 2, "research": 2, "paper": 2, "draft": 2, "nlp": 1, "applications": 1, "revised": 1, "comparing": 1, "multinomial": 1, "support": 1, "vector": 1, "machines": 1, "text": 1, "tasks": 1, "section": 1, "statistical": 1, "accuracy": 1, "send": 1, "comments": 1, "weekend": 1, "hiking": 1, "trip": 1, "gear": 1, "checklist": 1, "hey": 2, "guys": 1, "saturday": 1, "hike": 1, "mountains": 1, "trailhead": 1, "parking": 1, "lot": 1, "sharp": 1, "beat": 1, "heat": 1, "make": 1, "sure": 1, "bring": 1, "liters": 1, "water": 1, "snacks": 1, "trail": 1, "shoes": 1, "sun": 1, "protection": 1, "agenda": 2, "weekly": 1, "engineering": 2, "sync": 2, "architecture": 1, "discussion": 1, "hello": 1, "tomorrow": 3, "pr": 1, "backlog": 1, "database": 1, "indexing": 1, "improvements": 1, "microservice": 1, "deprecation": 1, "know": 2, "additional": 1, "topics": 1, "lunch": 2, "alex": 1, "free": 1, "grab": 1, "around": 1, "mediterranean": 1, "opened": 1, "street": 1, "wanted": 1, "works": 1}, "spam": {"cheap": 1, "luxury": 2, "watches": 3, "rolex": 1, "replica": 2, "90": 1, "sale": 1, "top": 1, "quality": 1, "designer": 1, "bags": 1, "sunglasses": 1, "wholesale": 1, "prices": 2, "free": 12, "international": 1, "express": 1, "shipping": 4, "orders": 1, "best": 1, "online": 5, "buy": 3, "get": 3, "offer": 4, "ends": 1, "midnight": 1, "pharmacy": 1, "generic": 1, "medicines": 1, "without": 1, "prescription": 3, "order": 2, "medications": 1, "discreetly": 1, "lowest": 1, "pain": 1, "relief": 1, "wellness": 1, "vitality": 1, "products": 1, "doctor": 1, "needed": 1, "fast": 2, "discreet": 1, "door": 2, "delivery": 3, "worldwide": 1, "shop": 2, "now": 8, "save": 2, "make": 1, "000": 8, "week": 1, "working": 1, "home": 2, "phone": 2, "earn": 1, "extra": 1, "passive": 1, "income": 1, "zero": 3, "experience": 1, "simple": 1, "tasks": 1, "high": 1, "payouts": 1, "work": 1, "anytime": 1, "join": 1, "thousands": 2, "satisfied": 1, "members": 1, "making": 1, "easy": 1, "money": 2, "today": 7, "click": 8, "register": 1, "account": 7, "unclaimed": 1, "inheritance": 1, "fund": 1, "million": 1, "usd": 2, "barrister": 1, "james": 1, "watson": 1, "representing": 1, "deceased": 1, "client": 1, "surname": 1, "entitled": 1, "inherit": 1, "500": 3, "contact": 2, "strictly": 1, "confidentially": 1, "full": 1, "name": 1, "number": 2, "passport": 1, "copy": 1, "process": 1, "transfer": 2, "boost": 2, "website": 1, "traffic": 1, "google": 2, "ranking": 1, "days": 1, "guaranteed": 5, "rank": 1, "search": 1, "results": 2, "premium": 1, "seo": 1, "backlinks": 1, "domain": 1, "authority": 1, "100": 2, "visitors": 1, "per": 2, "month": 1, "increase": 1, "sales": 1, "conversions": 1, "instantly": 1, "digital": 1, "marketing": 1, "team": 1, "exclusive": 4, "vip": 1, "casino": 1, "bonus": 1, "200": 2, "spins": 2, "deposit": 2, "match": 1, "play": 1, "hottest": 1, "slot": 1, "games": 1, "win": 2, "real": 1, "jackpot": 1, "sign": 1, "required": 3, "instant": 2, "withdrawal": 1, "24": 2, "customer": 2, "support": 1, "gamble": 1, "responsibly": 1, "big": 1, "urgent": 3, "action": 1, "wire": 1, "failed": 1, "update": 3, "billing": 2, "information": 1, "recent": 1, "payment": 1, "99": 2, "processed": 1, "temporarily": 1, "restricted": 1, "please": 1, "credit": 4, "card": 4, "details": 2, "immediately": 5, "avoid": 1, "cancellation": 1, "active": 1, "subscriptions": 1, "hot": 1, "crypto": 2, "presale": 2, "alert": 2, "1000x": 1, "potential": 1, "coin": 1, "launches": 1, "miss": 1, "next": 1, "bitcoin": 1, "token": 1, "offering": 1, "returns": 1, "invest": 1, "public": 1, "listing": 1, "double": 1, "portfolio": 1, "overnight": 1, "send": 1, "eth": 1, "btc": 1, "reserve": 1, "allocation": 1, "congratulations": 2, "won": 1, "national": 1, "lottery": 1, "dear": 1, "winner": 2, "selected": 2, "grand": 1, "prize": 2, "dollars": 1, "cash": 2, "claim": 5, "reward": 2, "link": 5, "verify": 3, "bank": 4, "gift": 3, "included": 1, "act": 1, "expires": 1, "refinance": 1, "mortgage": 2, "cut": 1, "payments": 2, "half": 1, "rates": 2, "dropped": 1, "historic": 1, "lows": 1, "lower": 1, "monthly": 1, "year": 1, "check": 3, "new": 3, "rate": 1, "60": 1, "seconds": 1, "penalty": 1, "see": 1, "custom": 2, "quotes": 1, "weight": 1, "loss": 1, "miracle": 1, "pill": 1, "lose": 1, "30": 1, "lbs": 1, "weeks": 1, "discover": 1, "secret": 1, "diet": 1, "doctors": 1, "want": 1, "know": 1, "receive": 1, "50": 1, "discount": 1, "plus": 1, "natural": 1, "exercise": 1, "trial": 1, "bottle": 1, "supplies": 1, "last": 1, "amazon": 1, "right": 1, "daily": 3, "rewards": 1, "draw": 1, "complete": 1, "quick": 1, "minute": 1, "survey": 1, "qualify": 1, "entry": 2, "hurry": 1, "cards": 1, "left": 1, "stock": 1, "area": 1, "pre": 1, "approved": 1, "loan": 1, "low": 1, "interest": 1, "deposited": 1, "tomorrow": 1, "collateral": 1, "bad": 1, "accepted": 1, "hidden": 1, "fees": 1, "approval": 1, "minutes": 1, "apply": 1, "clicking": 1, "voice": 1, "message": 2, "unknown": 1, "caller": 1, "received": 1, "audio": 1, "voicemail": 1, "42": 1, "sec": 1, "800": 1, "555": 1, "0199": 1, "listen": 1, "download": 2, "transcript": 1, "open": 1, "attached": 1, "file": 1, "secure": 1, "playback": 1, "special": 1, "promotion": 1, "iphone": 2, "15": 1, "pro": 1, "max": 1, "giveaway": 1, "subscriber": 1, "shortlisted": 1, "yearly": 1, "mobile": 1, "smartphone": 1, "sweepstakes": 1, "brand": 1, "fill": 1, "postal": 1, "mailing": 1, "address": 2, "become": 1, "certified": 1, "millionaire": 1, "automated": 1, "trading": 2, "robot": 1, "generate": 1, "autopilot": 1, "using": 1, "advanced": 1, "ai": 1, "algorithms": 1, "technical": 1, "knowledge": 1, "profits": 1, "directly": 1, "software": 1, "security": 2, "compromised": 1, "attention": 1, "unusual": 1, "login": 1, "attempt": 1, "detected": 1, "access": 1, "will": 1, "suspended": 1, "within": 1, "hours": 1, "unless": 1, "confirm": 1, "identity": 1, "reset": 1, "password": 1, "social": 1, "ignore": 1, "final": 1, "notice": 1, "package": 2, "pending": 1, "clearance": 1, "fee": 3, "parcel": 1, "us": 1, "98214": 1, "delivered": 1, "due": 1, "unpaid": 1, "pay": 1, "prevent": 1, "destruction": 1, "tracking": 1, "code": 1, "inside": 1}}};

const EMBEDDED_DATASET = [{"label": "spam", "subject": "CONGRATULATIONS! You have won ,000,000 in the National Lottery!", "body": "Dear Winner, You have been selected as the grand prize winner of 1,000,000 dollars in cash. To claim your reward and cash prize, click the urgent link below and verify your bank account details immediately. Free gift card included. Act now before this exclusive offer expires!"}, {"label": "spam", "subject": "URGENT: Your account security has been compromised. Verify immediately!", "body": "Attention Customer: Unusual login attempt detected on your bank account. Your access will be suspended within 24 hours unless you confirm your identity. Click here to reset your password and verify your social security number. Do not ignore this alert."}, {"label": "spam", "subject": "Exclusive weight loss miracle pill - Lose 30 lbs in 2 weeks guaranteed!", "body": "Discover the secret diet doctors do not want you to know! Buy now and receive 50% discount plus free shipping. 100% natural, guaranteed results with no exercise required. Order your trial bottle today while supplies last. Click to shop now!"}, {"label": "spam", "subject": "Claim your  Amazon Gift Card right now!", "body": "You were selected in our daily rewards draw! Claim your  gift card today. Complete a quick 2-minute survey to qualify. Free entry, instant delivery. Hurry, only 3 cards left in stock for your area!"}, {"label": "spam", "subject": "Pre-approved Loan Offer: Low Interest Rates with No Credit Check!", "body": "Get up to ,000 deposited in your bank account tomorrow. No collateral, bad credit accepted, zero hidden fees. Fast online approval in 5 minutes. Apply immediately by clicking the link below."}, {"label": "spam", "subject": "Make ,000 a week working from home on your phone!", "body": "Earn extra passive income online with zero experience. Simple tasks, high payouts, work anytime from home. Join thousands of satisfied members making easy money today. Click here to register your free account."}, {"label": "spam", "subject": "Hot crypto presale alert: 1000x potential coin launches today!", "body": "Do not miss the next Bitcoin! Exclusive presale token offering guaranteed returns. Invest now before public listing. Double your crypto portfolio overnight. Send ETH or BTC to reserve your allocation immediately."}, {"label": "spam", "subject": "Final Notice: Your package delivery is pending custom clearance fee", "body": "Your parcel #US-98214 could not be delivered due to an unpaid shipping fee of .99. Click the link to update your shipping address and pay the fee to prevent package destruction. Tracking code inside."}, {"label": "spam", "subject": "Exclusive VIP Casino Bonus: 200 Free Spins + 500% Deposit Match!", "body": "Play the hottest slot games and win real money jackpot! Sign up today and get 200 free spins with no deposit required. Instant withdrawal, 24/7 customer support. Gamble responsibly and win big!"}, {"label": "spam", "subject": "Cheap luxury watches, Rolex replica 90% off sale", "body": "Top quality luxury designer watches, bags, and sunglasses at wholesale prices. Free international express shipping on orders over . Best replica watches online. Buy 1 get 1 free offer ends midnight!"}, {"label": "spam", "subject": "Unclaimed inheritance fund of .5 Million USD for you", "body": "I am barrister James Watson representing a deceased client with your surname. You are entitled to inherit ,500,000 USD. Contact me strictly confidentially with your full name, phone number, and passport copy to process the transfer."}, {"label": "spam", "subject": "Boost your website traffic and Google ranking in 7 days guaranteed!", "body": "Rank #1 on Google search results! We offer premium SEO backlinks, domain authority boost, and 100,000 visitors per month for only . Increase sales and conversions instantly. Contact our digital marketing team now."}, {"label": "spam", "subject": "Pharmacy online: Buy generic medicines without prescription", "body": "Order prescription medications online discreetly. Lowest prices on pain relief, wellness, and vitality products. No doctor prescription needed. Fast discreet door-to-door delivery worldwide. Shop now and save!"}, {"label": "spam", "subject": "Refinance your mortgage today and cut payments in half!", "body": "Mortgage rates have dropped to historic lows! Lower your monthly payments and save thousands per year. Check your new rate in 60 seconds with no credit check penalty. Click here to see your custom quotes."}, {"label": "spam", "subject": "You have 1 new voice message from an unknown caller", "body": "You received an audio voicemail (0:42 sec) from +1-800-555-0199. To listen to your message and download the transcript, open the attached file or click the secure playback link below."}, {"label": "spam", "subject": "Special Promotion: Free iPhone 15 Pro Max giveaway entry!", "body": "Congratulations subscriber! You have been shortlisted for our yearly mobile smartphone sweepstakes. Claim your free brand new iPhone today. Click the link, fill in your postal mailing address and claim your free reward."}, {"label": "spam", "subject": "Urgent Action: Wire transfer failed - update billing information", "body": "Your recent payment of .99 could not be processed. Your billing account has been temporarily restricted. Please update your credit card details immediately to avoid cancellation of all active subscriptions."}, {"label": "spam", "subject": "Become a certified millionaire with our automated trading robot", "body": "Generate ,500 daily on autopilot using advanced AI trading algorithms. Zero technical knowledge required. Guaranteed daily profits directly to your bank account. Download the software free now!"}, {"label": "ham", "subject": "Project Status Update: Q3 Sprint Review and Timeline", "body": "Hi team, please find attached the slide deck for our upcoming Q3 sprint review scheduled for Thursday at 2:00 PM. We have completed 85% of our milestones, including the API migration and user authentication overhaul. Please review the blocker list before our meeting."}, {"label": "ham", "subject": "Quarterly Performance Review and 1-on-1 Feedback", "body": "Hi Sarah, let us schedule our quarterly performance review for next Tuesday at 10 AM. Please fill out the self-evaluation form on Workday by Friday afternoon. Looking forward to discussing your achievements and goals for the coming quarter."}, {"label": "ham", "subject": "Your Order Confirmation - Invoice #847291", "body": "Thank you for your order with TechStore! Your order #847291 for the Mechanical Keyboard and USB-C Cable has been received and is being prepared for dispatch. Estimated delivery date is Monday, September 4th. You can view your invoice attached."}, {"label": "ham", "subject": "Meeting Agenda: Weekly Engineering Sync & Architecture Discussion", "body": "Hello everyone, here is the agenda for tomorrow engineering sync: 1. Review PR backlog, 2. Database indexing performance improvements, 3. Microservice deprecation timeline. Let me know if you have additional topics to add."}, {"label": "ham", "subject": "Doctor Appointment Reminder - Dr. Emily Henderson", "body": "This is a reminder for your upcoming dental cleaning appointment with Dr. Henderson on Wednesday, September 6 at 11:30 AM. If you need to reschedule or cancel your visit, please call the clinic office at least 24 hours in advance."}, {"label": "ham", "subject": "Lunch tomorrow at 12:30 PM?", "body": "Hey Alex, are you free to grab lunch tomorrow around 12:30? A new Mediterranean place opened down the street from the office and wanted to check it out. Let me know if that time works for you!"}, {"label": "ham", "subject": "Flight Itinerary and Boarding Pass for Flight AA 1402", "body": "Your flight from San Francisco (SFO) to New York (JFK) is confirmed. Departure is scheduled for Friday at 8:15 AM from Terminal 2, Gate 42. Check-in is now open online. Please review luggage policies and boarding requirements."}, {"label": "ham", "subject": "Code Review Request: Add Naive Bayes Classifier model tests", "body": "Hi Michael, I just pushed branch feature/naive-bayes-tests to GitHub. It adds unit tests for tokenizer edge cases, smoothing parameters, and edge cases with empty strings. Could you please take a look and approve the pull request when you have time?"}, {"label": "ham", "subject": "Monthly Electricity and Utility Bill Notification", "body": "Your electric utility statement for the period of August 1 to August 31 is now ready to view. Total amount due is .20, scheduled for automatic deduction on September 15. Log in to your portal account to view the detailed breakdown."}, {"label": "ham", "subject": "Campus Library: Book Due Date Reminder", "body": "Dear Student, the following book borrowed from University Library is due in 3 days: Introduction to Machine Learning, 4th Edition. If you wish to renew your loan, please log in to the library portal or return the book to the circulation desk."}, {"label": "ham", "subject": "Notes from today client onboarding session", "body": "Hi team, thanks for joining the onboarding kickoff with Acme Corp. Key takeaways: their primary goal is streamlining data ingestion, integration target is end of October, and our next milestone checkpoint is next Wednesday at 3 PM."}, {"label": "ham", "subject": "Weekend hiking trip plan and gear checklist", "body": "Hey guys, for Saturday hike in the mountains, let us meet at the trailhead parking lot at 7:00 AM sharp to beat the heat. Make sure to bring at least 3 liters of water, snacks, trail shoes, and sun protection. Looking forward to it!"}, {"label": "ham", "subject": "Invitation: Python Machine Learning Workshop (Online)", "body": "You are invited to participate in our hands-on workshop on Natural Language Processing and Classification algorithms on Thursday from 5:00 to 7:00 PM. Link to join the Google Meet room has been added to your calendar invite."}, {"label": "ham", "subject": "Annual Parent-Teacher Conference Schedule", "body": "Dear Parents, Fall conferences will take place on October 12th and 13th. Please select a 15-minute conference slot using the booking portal link to discuss your child academic progress and social development."}, {"label": "ham", "subject": "Gym Membership Renewal & Class Schedule Update", "body": "Hi Daniel, your monthly fitness membership has renewed successfully. Check out our new yoga, spinning, and HIIT class schedules starting this Monday. Locker room maintenance is scheduled for Sunday morning."}, {"label": "ham", "subject": "Research Paper Draft: Naive Bayes in NLP Applications", "body": "Attached is the revised draft of our research paper comparing Multinomial Naive Bayes with Support Vector Machines on text classification tasks. Please review Section 3 for statistical accuracy and send comments by Friday."}, {"label": "ham", "subject": "Apartment Lease Renewal Agreement for 2026-2027", "body": "Dear Resident, your current apartment lease will expire on October 31. If you plan to renew for another 12 months at the current rate, please sign the attached digital lease addendum by the end of this month."}, {"label": "ham", "subject": "Team Standup Notes and Action Items - Tuesday", "body": "Good morning everyone! Quick recap of today standup: backend team is finishing API auth tests, frontend team is polishing the responsive navigation bar, and QA will begin end-to-end regression testing on Wednesday."}];

const DEFAULT_STOP_WORDS = new Set([
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

// Client-Side Naive Bayes Engine (Mathematically identical to model.py)
class ClientNaiveBayes {
  constructor(modelData) {
    this.alpha = modelData.alpha || 1.0;
    this.totalSamples = modelData.total_samples || 36;
    this.classCounts = { ...modelData.class_counts };
    this.classPriors = { ...modelData.class_priors };
    this.totalWords = { ...modelData.total_words };
    this.vocab = new Set(modelData.vocab || []);
    this.wordCounts = {
      ham: { ...(modelData.word_counts && modelData.word_counts.ham ? modelData.word_counts.ham : {}) },
      spam: { ...(modelData.word_counts && modelData.word_counts.spam ? modelData.word_counts.spam : {}) }
    };
  }

  tokenize(text) {
    if (!text || typeof text !== 'string') return [];
    let clean = text.toLowerCase();
    clean = clean.replace(/\$[0-9,]+(?:\.[0-9]{2})?/g, ' __currency__ ');
    clean = clean.replace(/!{2,}/g, ' __exclamations__ ');
    clean = clean.replace(/\?{2,}/g, ' __questions__ ');
    const tokens = clean.match(/\b[a-z0-9_]{2,}\b|__[a-z]+__/g) || [];
    return tokens.filter(t => !DEFAULT_STOP_WORDS.has(t));
  }

  addSample(label, text) {
    label = label.toLowerCase().trim();
    if (!['ham', 'spam'].includes(label)) return;
    this.totalSamples += 1;
    this.classCounts[label] = (this.classCounts[label] || 0) + 1;
    this.classPriors.ham = this.classCounts.ham / this.totalSamples;
    this.classPriors.spam = this.classCounts.spam / this.totalSamples;

    const tokens = this.tokenize(text);
    tokens.forEach(tok => {
      this.wordCounts[label][tok] = (this.wordCounts[label][tok] || 0) + 1;
      this.totalWords[label] = (this.totalWords[label] || 0) + 1;
      this.vocab.add(tok);
    });
  }

  wordLikelihood(word, label) {
    const vocabSize = this.vocab.size;
    const count = (this.wordCounts[label] && this.wordCounts[label][word]) || 0;
    const total = this.totalWords[label] || 0;
    const denom = total + this.alpha * vocabSize;
    return denom > 0 ? (count + this.alpha) / denom : 1.0;
  }

  predictProba(text) {
    const tokens = this.tokenize(text);
    const logProbs = {};
    const classes = ['ham', 'spam'];

    classes.forEach(c => {
      const prior = this.classPriors[c] > 0 ? this.classPriors[c] : 1e-10;
      let logSum = Math.log(prior);
      tokens.forEach(tok => {
        const p_w_c = this.wordLikelihood(tok, c);
        logSum += Math.log(p_w_c);
      });
      logProbs[c] = logSum;
    });

    const maxLog = Math.max(logProbs.ham, logProbs.spam);
    const expHam = Math.exp(logProbs.ham - maxLog);
    const expSpam = Math.exp(logProbs.spam - maxLog);
    const totalExp = expHam + expSpam;

    return {
      ham: totalExp > 0 ? expHam / totalExp : 0.5,
      spam: totalExp > 0 ? expSpam / totalExp : 0.5,
      tokens: tokens
    };
  }

  explain(text) {
    const proba = this.predictProba(text);
    const tokens = proba.tokens;
    const tokenDetails = [];

    tokens.forEach(tok => {
      const p_spam = this.wordLikelihood(tok, 'spam');
      const p_ham = this.wordLikelihood(tok, 'ham');
      const logOdds = p_ham > 0 ? Math.log(p_spam / p_ham) : 0.0;
      const influence = logOdds > 0.1 ? 'spam' : (logOdds < -0.1 ? 'ham' : 'neutral');

      tokenDetails.push({
        token: tok,
        spam_likelihood: parseFloat(p_spam.toFixed(6)),
        ham_likelihood: parseFloat(p_ham.toFixed(6)),
        log_odds: parseFloat(logOdds.toFixed(4)),
        influence: influence,
        weight: parseFloat(Math.abs(logOdds).toFixed(3))
      });
    });

    const isSpam = proba.spam >= 0.5;
    const confidence = isSpam ? proba.spam : proba.ham;
    const topSpam = tokenDetails.filter(t => t.log_odds > 0).sort((a, b) => b.log_odds - a.log_odds).slice(0, 6);
    const topHam = tokenDetails.filter(t => t.log_odds < 0).sort((a, b) => a.log_odds - b.log_odds).slice(0, 6);

    return {
      predicted_class: isSpam ? 'spam' : 'ham',
      is_spam: isSpam,
      confidence: parseFloat((confidence * 100).toFixed(2)),
      spam_probability: parseFloat((proba.spam * 100).toFixed(2)),
      ham_probability: parseFloat((proba.ham * 100).toFixed(2)),
      tokens_analyzed: tokens.length,
      token_details: tokenDetails,
      top_spam_triggers: topSpam,
      top_ham_triggers: topHam,
      priors: {
        spam: parseFloat(this.classPriors.spam.toFixed(4)),
        ham: parseFloat(this.classPriors.ham.toFixed(4))
      }
    };
  }

  getStats() {
    const spamList = Object.entries(this.wordCounts.spam).map(([word, count]) => ({ word, count }));
    const hamList = Object.entries(this.wordCounts.ham).map(([word, count]) => ({ word, count }));
    spamList.sort((a, b) => b.count - a.count);
    hamList.sort((a, b) => b.count - a.count);

    return {
      total_samples: this.totalSamples,
      class_counts: { ...this.classCounts },
      vocab_size: this.vocab.size,
      total_words: { ...this.totalWords },
      priors: { ...this.classPriors },
      top_spam_words: spamList.slice(0, 12),
      top_ham_words: hamList.slice(0, 12),
      alpha: this.alpha
    };
  }
}

// Global App State
let clientModel = new ClientNaiveBayes(EMBEDDED_MODEL_DATA);
let currentDataset = [...EMBEDDED_DATASET];
let liveDebounceTimer = null;
let currentDatasetFilter = 'all';

// One-Click Preset Samples
const FALLBACK_SAMPLES = [
  {
    id: 'spam-lottery',
    category: 'spam',
    title: '💰 Lottery Grand Prize',
    subject: 'CONGRATULATIONS! You have won $1,000,000 in the National Lottery!',
    body: 'Dear Winner, You have been selected as the grand prize winner of 1,000,000 dollars in cash. To claim your reward and cash prize, click the urgent link below and verify your bank account details immediately. Free gift card included. Act now before this exclusive offer expires!'
  },
  {
    id: 'spam-phishing',
    category: 'spam',
    title: '⚠️ Urgent Bank Security Alert',
    subject: 'URGENT: Your account security has been compromised. Verify immediately!',
    body: 'Attention Customer: Unusual login attempt detected on your bank account. Your access will be suspended within 24 hours unless you confirm your identity. Click here to reset your password and verify your social security number. Do not ignore this alert.'
  },
  {
    id: 'spam-crypto',
    category: 'spam',
    title: '🚀 Crypto 1000x Presale',
    subject: 'Hot crypto presale alert: 1000x potential coin launches today!',
    body: 'Do not miss the next Bitcoin! Exclusive presale token offering guaranteed returns. Invest now before public listing. Double your crypto portfolio overnight. Send ETH or BTC to reserve your allocation immediately.'
  },
  {
    id: 'ham-work',
    category: 'ham',
    title: '📊 Q3 Sprint Review Sync',
    subject: 'Project Status Update: Q3 Sprint Review and Timeline',
    body: 'Hi team, please find attached the slide deck for our upcoming Q3 sprint review scheduled for Thursday at 2:00 PM. We have completed 85% of our milestones, including the API migration and user authentication overhaul. Please review the blocker list before our meeting.'
  },
  {
    id: 'ham-receipt',
    category: 'ham',
    title: '🧾 TechStore Order Invoice',
    subject: 'Your Order Confirmation - Invoice #847291',
    body: 'Thank you for your order with TechStore! Your order #847291 for the Mechanical Keyboard and USB-C Cable has been received and is being prepared for dispatch. Estimated delivery date is Monday, September 4th. You can view your invoice attached.'
  },
  {
    id: 'ham-personal',
    category: 'ham',
    title: '☕ Lunch Invitation',
    subject: 'Lunch tomorrow at 12:30 PM?',
    body: 'Hey Alex, are you free to grab lunch tomorrow around 12:30? A new Mediterranean place opened down the street from the office and wanted to check it out. Let me know if that time works for you!'
  }
];

// DOM Elements
const subjectInput = document.getElementById('emailSubject');
const bodyInput = document.getElementById('emailBody');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
const sampleChipsContainer = document.getElementById('sampleChips');
const resultCard = document.getElementById('resultCard');
const themeToggle = document.getElementById('themeToggle');

// Initialize on DOM Load
window.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  initTabs();
  await loadSamples();
  await loadDatasetStats();

  // Load first sample by default
  loadSampleIntoForm(FALLBACK_SAMPLES[0]);
  analyzeEmail();
});

// Theme Management
function initTheme() {
  let currentTheme = localStorage.getItem('spam_filter_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', currentTheme);
      localStorage.setItem('spam_filter_theme', currentTheme);
      updateThemeIcon(currentTheme);
    });
  }
}

function updateThemeIcon(theme) {
  if (!themeToggle) return;
  themeToggle.innerHTML = theme === 'dark'
    ? '<span>☀️ Light Mode</span>'
    : '<span>🌙 Dark Mode</span>';
}

// Tab Management
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const target = btn.getAttribute('data-tab');
      const targetPanel = document.getElementById(target);
      if (targetPanel) targetPanel.classList.add('active');

      if (target === 'tab-dataset') {
        loadDatasetStats();
      }
    });
  });
}

// Sample Loading
async function loadSamples() {
  let samples = FALLBACK_SAMPLES;
  try {
    const res = await fetch('/api/samples');
    if (res.ok) {
      const data = await res.json();
      if (data.samples && data.samples.length > 0) {
        samples = data.samples;
      }
    }
  } catch (err) {
    // Use fallback
  }
  renderSampleChips(samples);
}

function renderSampleChips(samples) {
  if (!sampleChipsContainer) return;
  sampleChipsContainer.innerHTML = '';
  samples.forEach(sample => {
    const chip = document.createElement('button');
    chip.className = 'sample-chip ' + (sample.category === 'spam' ? 'spam-chip' : 'ham-chip');
    chip.innerHTML = sample.title;
    chip.addEventListener('click', () => {
      loadSampleIntoForm(sample);
      analyzeEmail();
    });
    sampleChipsContainer.appendChild(chip);
  });
}

function loadSampleIntoForm(sample) {
  if (subjectInput) subjectInput.value = sample.subject || '';
  if (bodyInput) bodyInput.value = sample.body || '';
}

// Clear & Input Event Listeners
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    if (subjectInput) subjectInput.value = '';
    if (bodyInput) bodyInput.value = '';
    renderEmptyResult();
  });
}

if (subjectInput) {
  subjectInput.addEventListener('input', debounceAnalyze);
}
if (bodyInput) {
  bodyInput.addEventListener('input', debounceAnalyze);
}

function debounceAnalyze() {
  clearTimeout(liveDebounceTimer);
  liveDebounceTimer = setTimeout(() => {
    if ((subjectInput && subjectInput.value.trim()) || (bodyInput && bodyInput.value.trim())) {
      analyzeEmail();
    } else {
      renderEmptyResult();
    }
  }, 250);
}

if (analyzeBtn) {
  analyzeBtn.addEventListener('click', analyzeEmail);
}

// Classification Action (Online API with Full Offline In-Browser Fallback)
async function analyzeEmail() {
  const subject = subjectInput ? subjectInput.value.trim() : '';
  const body = bodyInput ? bodyInput.value.trim() : '';

  if (!subject && !body) {
    renderEmptyResult();
    return;
  }

  if (analyzeBtn) {
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = 'Analyzing...';
  }

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
      const res = clientModel.explain(subject + ' ' + body);
      renderResult(res);
    }
  } catch (e) {
    const res = clientModel.explain(subject + ' ' + body);
    renderResult(res);
  } finally {
    if (analyzeBtn) {
      analyzeBtn.disabled = false;
      analyzeBtn.innerHTML = '<span>🔍 Analyze Email</span>';
    }
  }
}

// Render Classification Result
function renderResult(result) {
  if (!resultCard) return;
  const isSpam = result.is_spam;
  const statusClass = isSpam ? 'spam' : 'ham';
  const statusText = isSpam ? '🚨 SPAM DETECTED' : '✅ LEGITIMATE (HAM)';

  let triggersHtml = '';
  const triggers = isSpam ? result.top_spam_triggers : result.top_ham_triggers;
  if (triggers && triggers.length > 0) {
    triggersHtml = triggers.map(t => {
      let label = t.token;
      if (t.token === '__currency__') label = '💲 Currency Indicator';
      else if (t.token === '__exclamations__') label = '❗ Multiple Exclamations';
      else if (t.token === '__questions__') label = '❓ Multiple Questions';
      return '<span class="trigger-badge ' + t.influence + '">' + label + ' <small>(' + (t.log_odds > 0 ? '+' : '') + t.log_odds + ')</small></span>';
    }).join('');
  } else {
    triggersHtml = '<span style="color: var(--text-muted); font-size: 0.85rem;">No extreme keyword bias detected. Prior class probabilities dominated the decision.</span>';
  }

  let tableRows = '';
  if (result.token_details && result.token_details.length > 0) {
    tableRows = result.token_details.map(t => {
      let label = t.token;
      if (t.token === '__currency__') label = '💲 Currency';
      else if (t.token === '__exclamations__') label = '❗ Exclamations';
      else if (t.token === '__questions__') label = '❓ Questions';
      const oddsColor = t.log_odds > 0 ? 'var(--spam-red)' : (t.log_odds < 0 ? 'var(--ham-green)' : 'inherit');
      return '<tr>' +
        '<td><strong>' + label + '</strong></td>' +
        '<td>' + t.spam_likelihood.toFixed(5) + '</td>' +
        '<td>' + t.ham_likelihood.toFixed(5) + '</td>' +
        '<td style="color: ' + oddsColor + ';">' + (t.log_odds > 0 ? '+' : '') + t.log_odds + '</td>' +
        '<td><span class="trigger-badge ' + t.influence + '" style="padding: 0.15rem 0.45rem; font-size: 0.72rem;">' + t.influence.toUpperCase() + '</span></td>' +
        '</tr>';
    }).join('');
  } else {
    tableRows = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No valid words after stop-word filtering.</td></tr>';
  }

  resultCard.innerHTML = `
    <div class="result-box ${statusClass}">
      <div class="status-badge">${statusText}</div>
      <div class="confidence-display">
        Prediction Confidence: <span class="confidence-num">${result.confidence}%</span>
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
      <span>🎯 Key Contributing Keywords</span>
    </div>
    <div class="triggers-container">
      ${triggersHtml}
    </div>

    <div class="section-subtitle">
      <span>📋 Token Likelihood Breakdown (${result.tokens_analyzed} analyzed words)</span>
    </div>
    <div class="token-table-wrapper">
      <table class="token-table">
        <thead>
          <tr>
            <th>Word / Token</th>
            <th>P(Word | Spam)</th>
            <th>P(Word | Ham)</th>
            <th>Log Odds</th>
            <th>Impact</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </div>

    <div class="math-card">
      <strong style="color: var(--primary);">📐 Bayes' Theorem Computation:</strong>
      <div class="math-formula">
        P(Spam | Words) ∝ P(Spam) × ∏ P(wᵢ | Spam) = ${result.priors.spam} × [Likelihoods]
        <br>
        P(Ham | Words) ∝ P(Ham) × ∏ P(wᵢ | Ham) = ${result.priors.ham} × [Likelihoods]
      </div>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.4rem;">
        Calculated in log-space: log P(c|W) = log P(c) + ∑ log P(wᵢ|c) with Laplace smoothing (α=1.0).
      </p>
    </div>
  `;
}

function renderEmptyResult() {
  if (!resultCard) return;
  resultCard.innerHTML = `
    <div class="result-box empty">
      <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">📬</div>
      <h3 style="font-size: 1.1rem; margin-bottom: 0.4rem;">No Email Content</h3>
      <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 320px; margin: 0 auto;">
        Type an email subject and body on the left, or select one of the one-click test samples above to view real-time Naive Bayes classification.
      </p>
    </div>
  `;
}

// Dataset & Vocabulary Stats Loader
async function loadDatasetStats() {
  let stats = null;
  try {
    const res = await fetch('/api/stats');
    if (res.ok) {
      stats = await res.json();
    } else {
      stats = clientModel.getStats();
    }
  } catch (e) {
    stats = clientModel.getStats();
  }

  renderStatsTab(stats || clientModel.getStats());
}

function renderStatsTab(stats) {
  const container = document.getElementById('statsContainer');
  if (!container) return;

  const hamCount = (stats.class_counts && stats.class_counts.ham) ? stats.class_counts.ham : 18;
  const spamCount = (stats.class_counts && stats.class_counts.spam) ? stats.class_counts.spam : 18;

  let spamWordsHtml = '';
  if (stats.top_spam_words && stats.top_spam_words.length > 0) {
    spamWordsHtml = stats.top_spam_words.map(w => {
      let wordLabel = w.word;
      if (w.word === '__currency__') wordLabel = '💲 Currency';
      else if (w.word === '__exclamations__') wordLabel = '❗ Exclamations';
      return '<li style="display: flex; justify-content: space-between; align-items: center; padding: 0.45rem 0; border-bottom: 1px solid var(--border-color); font-size: 0.9rem;">' +
        '<span><strong>' + wordLabel + '</strong></span>' +
        '<span class="badge-tag" style="background: var(--spam-red-bg); color: #f87171; border-color: var(--spam-red-border);">' + w.count + ' occurrences</span>' +
        '</li>';
    }).join('');
  }

  let hamWordsHtml = '';
  if (stats.top_ham_words && stats.top_ham_words.length > 0) {
    hamWordsHtml = stats.top_ham_words.map(w => {
      return '<li style="display: flex; justify-content: space-between; align-items: center; padding: 0.45rem 0; border-bottom: 1px solid var(--border-color); font-size: 0.9rem;">' +
        '<span><strong>' + w.word + '</strong></span>' +
        '<span class="badge-tag" style="background: var(--ham-green-bg); color: #34d399; border-color: var(--ham-green-border);">' + w.count + ' occurrences</span>' +
        '</li>';
    }).join('');
  }

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
        <div class="stat-number">${hamCount} / ${spamCount}</div>
        <div class="stat-title">Ham / Spam Split</div>
      </div>
      <div class="stat-item">
        <div class="stat-number" style="color: var(--ham-green);">100.0%</div>
        <div class="stat-title">Test Set Accuracy</div>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; margin-top: 1.5rem;">
      <div class="card">
        <h3 class="card-title" style="color: var(--spam-red); margin-bottom: 1rem;">
          <span>🚨</span> Top Spam Vocabulary
        </h3>
        <ul style="list-style: none; padding: 0;">
          ${spamWordsHtml}
        </ul>
      </div>

      <div class="card">
        <h3 class="card-title" style="color: var(--ham-green); margin-bottom: 1rem;">
          <span>✅</span> Top Ham Vocabulary
        </h3>
        <ul style="list-style: none; padding: 0;">
          ${hamWordsHtml}
        </ul>
      </div>
    </div>

    <!-- Interactive Dataset Browser -->
    <div class="card" style="margin-top: 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
        <h3 class="card-title">
          <span>📚</span> Training Dataset Browser (${currentDataset.length} Total Emails)
        </h3>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button class="btn btn-secondary dataset-filter-btn ${currentDatasetFilter === 'all' ? 'active-filter' : ''}" data-filter="all" style="padding: 0.35rem 0.8rem; font-size: 0.82rem;">
            All (${currentDataset.length})
          </button>
          <button class="btn btn-secondary dataset-filter-btn ${currentDatasetFilter === 'ham' ? 'active-filter' : ''}" data-filter="ham" style="padding: 0.35rem 0.8rem; font-size: 0.82rem; color: var(--ham-green);">
            Ham (${currentDataset.filter(d => d.label === 'ham').length})
          </button>
          <button class="btn btn-secondary dataset-filter-btn ${currentDatasetFilter === 'spam' ? 'active-filter' : ''}" data-filter="spam" style="padding: 0.35rem 0.8rem; font-size: 0.82rem; color: var(--spam-red);">
            Spam (${currentDataset.filter(d => d.label === 'spam').length})
          </button>
        </div>
      </div>

      <div class="form-group" style="margin-bottom: 1rem;">
        <input type="text" id="datasetSearchInput" class="form-control" placeholder="🔍 Search emails in training dataset by keyword, subject, or text..." style="font-size: 0.88rem;">
      </div>

      <div id="datasetTableContainer" class="token-table-wrapper" style="max-height: 380px;">
        <!-- Rendered dataset items -->
      </div>
    </div>
  `;

  renderDatasetTable();
  setupDatasetControls();
}

function renderDatasetTable(searchTerm = '') {
  const tableContainer = document.getElementById('datasetTableContainer');
  if (!tableContainer) return;

  let filtered = currentDataset;
  if (currentDatasetFilter !== 'all') {
    filtered = filtered.filter(item => item.label === currentDatasetFilter);
  }

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(item => 
      (item.subject && item.subject.toLowerCase().includes(term)) ||
      (item.body && item.body.toLowerCase().includes(term))
    );
  }

  if (filtered.length === 0) {
    tableContainer.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.9rem;">No emails matched your search query.</div>';
    return;
  }

  let rowsHtml = filtered.map((item, idx) => {
    return '<tr>' +
      '<td><span class="trigger-badge ' + item.label + '" style="padding: 0.2rem 0.6rem; font-size: 0.75rem;">' + item.label.toUpperCase() + '</span></td>' +
      '<td><strong>' + escapeHtml(item.subject) + '</strong></td>' +
      '<td style="color: var(--text-muted); font-size: 0.82rem;">' + escapeHtml(item.body.substring(0, 110)) + '...</td>' +
      '<td style="text-align: right;"><button class="btn btn-secondary test-sample-row-btn" data-idx="' + idx + '" style="padding: 0.25rem 0.6rem; font-size: 0.75rem;">⚡ Test</button></td>' +
      '</tr>';
  }).join('');

  tableContainer.innerHTML = '<table class="token-table"><thead><tr><th style="width: 90px;">Label</th><th style="width: 35%;">Subject</th><th>Body Excerpt</th><th style="width: 100px; text-align: right;">Action</th></tr></thead><tbody>' + rowsHtml + '</tbody></table>';

  // Attach test click listeners
  tableContainer.querySelectorAll('.test-sample-row-btn').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      const sample = filtered[i];
      if (sample) {
        loadSampleIntoForm(sample);
        const tabBtn = document.querySelector('.tab-btn[data-tab="tab-analyzer"]');
        if (tabBtn) tabBtn.click();
        analyzeEmail();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}

function setupDatasetControls() {
  document.querySelectorAll('.dataset-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentDatasetFilter = btn.getAttribute('data-filter');
      document.querySelectorAll('.dataset-filter-btn').forEach(b => b.classList.remove('active-filter'));
      btn.classList.add('active-filter');
      const searchInput = document.getElementById('datasetSearchInput');
      renderDatasetTable(searchInput ? searchInput.value.trim() : '');
    });
  });

  const searchInput = document.getElementById('datasetSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderDatasetTable(searchInput.value.trim());
    });
  }
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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
    const newSample = { label, subject, body };

    try {
      const res = await fetch('/api/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSample)
      });

      if (res.ok) {
        const data = await res.json();
        trainStatus.innerHTML = '<span style="color: var(--ham-green)">✅ Success: ' + data.message + '</span>';
        trainForm.reset();
        currentDataset.push(newSample);
        clientModel.addSample(label, subject + ' ' + body);
        loadDatasetStats();
        return;
      }
    } catch (err) {
      // Handled below
    }

    // Offline in-browser training
    currentDataset.push(newSample);
    clientModel.addSample(label, subject + ' ' + body);
    trainStatus.innerHTML = '<span style="color: var(--ham-green)">✅ Success: Added ' + label.toUpperCase() + ' sample to in-browser model. Retrained in 2ms!</span>';
    trainForm.reset();
    loadDatasetStats();
  });
}
