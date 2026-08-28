"""
Email Spam Filter Web Server
Runs an HTTP server with REST APIs for classification, dataset inspection,
and model diagnostics. Works with zero external pip dependencies using Python's
built-in standard library, with optional Flask integration.
"""

import os
import sys
import json
import urllib.parse
from http.server import HTTPServer, SimpleHTTPRequestHandler
from socketserver import ThreadingMixIn
from model import NaiveBayesClassifier

# Ensure UTF-8 output encoding for Windows terminals
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
STATIC_DIR = os.path.join(BASE_DIR, 'static')
VOCAB_PATH = os.path.join(DATA_DIR, 'vocabulary.json')
DATASET_PATH = os.path.join(DATA_DIR, 'spam_dataset.json')

# Initialize and load model
clf = NaiveBayesClassifier()
if os.path.exists(VOCAB_PATH):
    clf.load_json(VOCAB_PATH)
else:
    # Train on startup if vocabulary.json is missing
    with open(DATASET_PATH, 'r', encoding='utf-8') as f:
        raw_data = json.load(f)
    texts = [f"{item['subject']} {item['body']}" for item in raw_data]
    labels = [item['label'] for item in raw_data]
    clf.fit(texts, labels)
    clf.save_json(VOCAB_PATH)

SAMPLE_EMAILS = [
    {
        "id": "spam-lottery",
        "category": "spam",
        "title": "Lottery Grand Prize",
        "subject": "CONGRATULATIONS! You have won $1,000,000 in the National Lottery!",
        "body": "Dear Winner, You have been selected as the grand prize winner of 1,000,000 dollars in cash. To claim your reward and cash prize, click the urgent link below and verify your bank account details immediately. Free gift card included. Act now before this exclusive offer expires!"
    },
    {
        "id": "spam-phishing",
        "category": "spam",
        "title": "Urgent Security Alert",
        "subject": "URGENT: Your account security has been compromised. Verify immediately!",
        "body": "Attention Customer: Unusual login attempt detected on your bank account. Your access will be suspended within 24 hours unless you confirm your identity. Click here to reset your password and verify your social security number. Do not ignore this alert."
    },
    {
        "id": "spam-crypto",
        "category": "spam",
        "title": "Crypto 1000x Presale",
        "subject": "Hot crypto presale alert: 1000x potential coin launches today!",
        "body": "Don't miss the next Bitcoin! Exclusive presale token offering guaranteed returns. Invest now before public listing. Double your crypto portfolio overnight. Send ETH or BTC to reserve your allocation immediately."
    },
    {
        "id": "ham-work",
        "category": "ham",
        "title": "Sprint Review Sync",
        "subject": "Project Status Update: Q3 Sprint Review and Timeline",
        "body": "Hi team, please find attached the slide deck for our upcoming Q3 sprint review scheduled for Thursday at 2:00 PM. We have completed 85% of our milestones, including the API migration and user authentication overhaul. Please review the blocker list before our meeting."
    },
    {
        "id": "ham-receipt",
        "category": "ham",
        "title": "TechStore Order Invoice",
        "subject": "Your Order Confirmation - Invoice #847291",
        "body": "Thank you for your order with TechStore! Your order #847291 for the Mechanical Keyboard and USB-C Cable has been received and is being prepared for dispatch. Estimated delivery date is Monday, September 4th. You can view your invoice attached."
    },
    {
        "id": "ham-personal",
        "category": "ham",
        "title": "Lunch Invitation",
        "subject": "Lunch tomorrow at 12:30 PM?",
        "body": "Hey Alex, are you free to grab lunch tomorrow around 12:30? A new Mediterranean place opened down the street from the office and wanted to check it out. Let me know if that time works for you!"
    }
]

def get_model_stats():
    top_spam_words = [
        {"word": w, "count": c} 
        for w, c in clf.word_counts['spam'].most_common(12)
    ]
    top_ham_words = [
        {"word": w, "count": c} 
        for w, c in clf.word_counts['ham'].most_common(12)
    ]
    return {
        "status": "success",
        "total_samples": clf.total_samples,
        "class_counts": clf.class_counts,
        "vocab_size": len(clf.vocab),
        "total_words": clf.total_words,
        "priors": clf.class_priors,
        "top_spam_words": top_spam_words,
        "top_ham_words": top_ham_words,
        "alpha": clf.alpha
    }

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True

class SpamFilterRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path in ['/', '/index.html']:
            index_path = os.path.join(BASE_DIR, 'index.html')
            if not os.path.exists(index_path):
                index_path = os.path.join(BASE_DIR, 'templates', 'index.html')
            
            with open(index_path, 'rb') as f:
                content = f.read()
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(content)))
            self.end_headers()
            self.wfile.write(content)
            return

        elif path == '/api/stats':
            stats = get_model_stats()
            body = json.dumps(stats).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        elif path == '/api/samples':
            body = json.dumps({"status": "success", "samples": SAMPLE_EMAILS}).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        elif path.startswith('/static/'):
            filename = path[len('/static/'):]
            file_path = os.path.join(STATIC_DIR, filename)
            if os.path.exists(file_path) and os.path.isfile(file_path):
                mime_type = 'text/plain'
                if file_path.endswith('.css'):
                    mime_type = 'text/css'
                elif file_path.endswith('.js'):
                    mime_type = 'application/javascript'
                elif file_path.endswith('.json'):
                    mime_type = 'application/json'
                elif file_path.endswith('.svg'):
                    mime_type = 'image/svg+xml'
                
                with open(file_path, 'rb') as f:
                    content = f.read()
                self.send_response(200)
                self.send_header('Content-Type', mime_type)
                self.send_header('Content-Length', str(len(content)))
                self.end_headers()
                self.wfile.write(content)
                return

        super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else '{}'

        try:
            payload = json.loads(post_data)
        except Exception:
            payload = {}

        if path == '/api/predict':
            subject = payload.get('subject', '').strip()
            body_text = payload.get('body', '').strip()
            full_text = payload.get('text', '').strip()
            if not full_text:
                full_text = f"{subject} {body_text}".strip()

            if not full_text:
                response = {
                    "status": "error",
                    "message": "Please enter an email subject or message body."
                }
                status_code = 400
            else:
                explanation = clf.explain(full_text)
                response = {
                    "status": "success",
                    "subject": subject,
                    "body": body_text,
                    "result": explanation
                }
                status_code = 200

            resp_bytes = json.dumps(response).encode('utf-8')
            self.send_response(status_code)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(resp_bytes)))
            self.end_headers()
            self.wfile.write(resp_bytes)
            return

        elif path == '/api/train':
            subject = payload.get('subject', '').strip()
            body_text = payload.get('body', '').strip()
            label = payload.get('label', '').lower().strip()
            
            if label not in ['ham', 'spam'] or (not subject and not body_text):
                resp = {"status": "error", "message": "Invalid training sample. Label must be 'ham' or 'spam'."}
                status_code = 400
            else:
                new_entry = {"label": label, "subject": subject, "body": body_text}
                with open(DATASET_PATH, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                data.append(new_entry)
                with open(DATASET_PATH, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2)
                
                # Retrain
                texts = [f"{item['subject']} {item['body']}" for item in data]
                labels = [item['label'] for item in data]
                clf.fit(texts, labels)
                clf.save_json(VOCAB_PATH)

                resp = {
                    "status": "success",
                    "message": f"Added 1 {label.upper()} sample and retrained model.",
                    "total_samples": len(data)
                }
                status_code = 200

            resp_bytes = json.dumps(resp).encode('utf-8')
            self.send_response(status_code)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(resp_bytes)))
            self.end_headers()
            self.wfile.write(resp_bytes)
            return

        self.send_response(404)
        self.end_headers()


def run_server(port=5000):
    server_address = ('127.0.0.1', port)
    try:
        httpd = ThreadedHTTPServer(server_address, SpamFilterRequestHandler)
        print("=" * 60)
        print("[SERVER RUNNING] Email Spam Filter Web App")
        print(f"Local URL:   http://127.0.0.1:{port}")
        print(f"Web Browser: http://localhost:{port}")
        print("=" * 60)
        print("Press Ctrl+C to stop the server.")
        httpd.serve_forever()
    except OSError as e:
        if port == 5000:
            print(f"Port 5000 busy, trying fallback port 8080...")
            run_server(8080)
        else:
            raise e

if __name__ == '__main__':
    port = 5000
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        port = int(sys.argv[1])
    run_server(port)