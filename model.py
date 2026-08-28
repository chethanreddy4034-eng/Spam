"""
Multinomial Naive Bayes Classifier for Email Spam Filtering
Pure Python implementation with text preprocessing, Laplace smoothing,
log-space computations, and word-level feature interpretability.
"""

import re
import math
import json
from collections import Counter
from typing import List, Dict, Tuple, Any, Optional

DEFAULT_STOP_WORDS = {
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
}


class NaiveBayesClassifier:
    def __init__(self, alpha: float = 1.0, stop_words: Optional[set] = None):
        """
        Initialize the Naive Bayes Classifier.
        :param alpha: Laplace smoothing parameter (default 1.0)
        :param stop_words: Set of stop words to filter out
        """
        self.alpha = float(alpha)
        self.stop_words = stop_words if stop_words is not None else DEFAULT_STOP_WORDS
        
        # Model Parameters
        self.classes = ['ham', 'spam']
        self.class_counts = {'ham': 0, 'spam': 0}
        self.word_counts = {'ham': Counter(), 'spam': Counter()}
        self.total_words = {'ham': 0, 'spam': 0}
        self.vocab = set()
        self.class_priors = {'ham': 0.5, 'spam': 0.5}
        self.total_samples = 0
        self.is_trained = False

    def tokenize(self, text: str) -> List[str]:
        """
        Cleans and tokenizes input text into normalized words.
        """
        if not text or not isinstance(text, str):
            return []
        
        # Lowercase
        text = text.lower()
        
        # Normalize currency and exclamation indicators
        text = re.sub(r'\$[0-9,]+(?:\.[0-9]{2})?', ' __currency__ ', text)
        text = re.sub(r'!{2,}', ' __exclamations__ ', text)
        text = re.sub(r'\?{2,}', ' __questions__ ', text)
        
        # Extract word tokens (alphanumeric and special markers)
        tokens = re.findall(r'\b[a-z0-9_]{2,}\b|__[a-z]+__', text)
        
        # Filter stop words
        return [t for t in tokens if t not in self.stop_words]

    def fit(self, texts: List[str], labels: List[str]):
        """
        Train the Naive Bayes model on training texts and labels.
        """
        self.class_counts = {'ham': 0, 'spam': 0}
        self.word_counts = {'ham': Counter(), 'spam': Counter()}
        self.total_words = {'ham': 0, 'spam': 0}
        self.vocab = set()
        self.total_samples = len(texts)

        for text, label in zip(texts, labels):
            label = label.lower().strip()
            if label not in self.classes:
                continue
            self.class_counts[label] += 1
            tokens = self.tokenize(text)
            for token in tokens:
                self.word_counts[label][token] += 1
                self.total_words[label] += 1
                self.vocab.add(token)

        # Calculate prior probabilities: P(c) = N_c / N_total
        for c in self.classes:
            self.class_priors[c] = (self.class_counts[c] / self.total_samples) if self.total_samples > 0 else 0.5

        self.is_trained = True
        return self

    def _word_likelihood(self, word: str, label: str) -> float:
        """
        Calculates P(w | c) using Laplace smoothing:
        P(w|c) = (count(w, c) + alpha) / (total_words(c) + alpha * |V|)
        """
        vocab_size = len(self.vocab)
        count_w_c = self.word_counts[label].get(word, 0)
        total_c = self.total_words[label]
        denom = total_c + self.alpha * vocab_size
        return (count_w_c + self.alpha) / denom if denom > 0 else 1.0

    def predict_proba(self, text: str) -> Dict[str, float]:
        """
        Calculates posterior probabilities P(c | text) using log-sum-exp normalization.
        """
        if not self.is_trained:
            raise ValueError("Model must be trained before predicting.")

        tokens = self.tokenize(text)
        
        log_probs = {}
        for c in self.classes:
            log_prior = math.log(self.class_priors[c] if self.class_priors[c] > 0 else 1e-10)
            log_likelihood_sum = 0.0
            for token in tokens:
                p_w_c = self._word_likelihood(token, c)
                log_likelihood_sum += math.log(p_w_c)
            log_probs[c] = log_prior + log_likelihood_sum

        # Softmax / Log-sum-exp normalization
        max_log = max(log_probs.values())
        exp_ham = math.exp(log_probs['ham'] - max_log)
        exp_spam = math.exp(log_probs['spam'] - max_log)
        total_exp = exp_ham + exp_spam

        prob_spam = exp_spam / total_exp if total_exp > 0 else 0.5
        prob_ham = exp_ham / total_exp if total_exp > 0 else 0.5

        return {
            'ham': prob_ham,
            'spam': prob_spam,
            'log_ham': log_probs['ham'],
            'log_spam': log_probs['spam']
        }

    def predict(self, text: str) -> str:
        """
        Returns predicted class label ('ham' or 'spam').
        """
        proba = self.predict_proba(text)
        return 'spam' if proba['spam'] >= 0.5 else 'ham'

    def explain(self, text: str) -> Dict[str, Any]:
        """
        Provides detailed word-level diagnostic explanation of the classification.
        """
        tokens = self.tokenize(text)
        proba = self.predict_proba(text)
        
        token_analysis = []
        for token in tokens:
            p_spam = self._word_likelihood(token, 'spam')
            p_ham = self._word_likelihood(token, 'ham')
            log_ratio = math.log(p_spam / p_ham) if p_ham > 0 else 0.0
            
            token_analysis.append({
                'token': token,
                'spam_likelihood': round(p_spam, 6),
                'ham_likelihood': round(p_ham, 6),
                'log_odds': round(log_ratio, 4),
                'influence': 'spam' if log_ratio > 0.1 else ('ham' if log_ratio < -0.1 else 'neutral'),
                'weight': round(abs(log_ratio), 3)
            })

        # Top spam and ham indicator tokens
        top_spam_words = sorted([t for t in token_analysis if t['log_odds'] > 0], key=lambda x: x['log_odds'], reverse=True)[:6]
        top_ham_words = sorted([t for t in token_analysis if t['log_odds'] < 0], key=lambda x: x['log_odds'])[:6]

        is_spam = proba['spam'] >= 0.5
        confidence = proba['spam'] if is_spam else proba['ham']

        return {
            'predicted_class': 'spam' if is_spam else 'ham',
            'is_spam': is_spam,
            'confidence': round(confidence * 100, 2),
            'spam_probability': round(proba['spam'] * 100, 2),
            'ham_probability': round(proba['ham'] * 100, 2),
            'tokens_analyzed': len(tokens),
            'token_details': token_analysis,
            'top_spam_triggers': top_spam_words,
            'top_ham_triggers': top_ham_words,
            'priors': {
                'spam': round(self.class_priors['spam'], 4),
                'ham': round(self.class_priors['ham'], 4)
            }
        }

    def to_dict(self) -> Dict[str, Any]:
        """
        Serializes model parameters into a JSON-friendly dict.
        """
        return {
            'alpha': self.alpha,
            'total_samples': self.total_samples,
            'class_counts': self.class_counts,
            'class_priors': self.class_priors,
            'total_words': self.total_words,
            'vocab_size': len(self.vocab),
            'vocab': list(self.vocab),
            'word_counts': {
                'ham': dict(self.word_counts['ham']),
                'spam': dict(self.word_counts['spam'])
            }
        }

    def from_dict(self, data: Dict[str, Any]):
        """
        Restores model from a serialized dict.
        """
        self.alpha = float(data.get('alpha', 1.0))
        self.total_samples = data.get('total_samples', 0)
        self.class_counts = data.get('class_counts', {'ham': 0, 'spam': 0})
        self.class_priors = data.get('class_priors', {'ham': 0.5, 'spam': 0.5})
        self.total_words = data.get('total_words', {'ham': 0, 'spam': 0})
        self.vocab = set(data.get('vocab', []))
        self.word_counts = {
            'ham': Counter(data.get('word_counts', {}).get('ham', {})),
            'spam': Counter(data.get('word_counts', {}).get('spam', {}))
        }
        self.is_trained = True
        return self

    def save_json(self, filepath: str):
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(self.to_dict(), f, indent=2)

    def load_json(self, filepath: str):
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return self.from_dict(data)