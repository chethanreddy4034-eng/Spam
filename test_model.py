"""
Unit Tests for Naive Bayes Email Spam Filter
"""

import unittest
import os
from model import NaiveBayesClassifier

class TestNaiveBayesClassifier(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.base_dir = os.path.dirname(os.path.abspath(__file__))
        cls.vocab_path = os.path.join(cls.base_dir, 'data', 'vocabulary.json')
        cls.clf = NaiveBayesClassifier()
        cls.clf.load_json(cls.vocab_path)

    def test_spam_detection_lottery(self):
        email = "WINNER! You won $5,000,000 cash prize in the international lottery. Claim immediately!"
        explanation = self.clf.explain(email)
        self.assertEqual(explanation['predicted_class'], 'spam')
        self.assertTrue(explanation['is_spam'])
        self.assertGreaterEqual(explanation['spam_probability'], 80.0)
        self.assertTrue(len(explanation['top_spam_triggers']) > 0)

    def test_spam_detection_phishing(self):
        email = "Urgent: Your bank account access is suspended. Verify password and credit card immediately."
        explanation = self.clf.explain(email)
        self.assertEqual(explanation['predicted_class'], 'spam')
        self.assertTrue(explanation['is_spam'])

    def test_ham_detection_work(self):
        email = "Hi team, please review the sprint meeting slide deck and let me know your thoughts before Thursday."
        explanation = self.clf.explain(email)
        self.assertEqual(explanation['predicted_class'], 'ham')
        self.assertFalse(explanation['is_spam'])
        self.assertGreaterEqual(explanation['ham_probability'], 80.0)

    def test_ham_detection_personal(self):
        email = "Hey Alex, are we still meeting for lunch at 12:30 tomorrow? Let me know!"
        explanation = self.clf.explain(email)
        self.assertEqual(explanation['predicted_class'], 'ham')
        self.assertFalse(explanation['is_spam'])

    def test_empty_string_handling(self):
        explanation = self.clf.explain("")
        self.assertIn(explanation['predicted_class'], ['ham', 'spam'])
        self.assertEqual(explanation['tokens_analyzed'], 0)

    def test_smoothing_handles_unseen_words(self):
        email = "Xyzqwerty abcdefghijk unknown gibberish vocabulary"
        explanation = self.clf.explain(email)
        self.assertIsNotNone(explanation['confidence'])

if __name__ == '__main__':
    unittest.main()
