"""
Training and Evaluation Script for Naive Bayes Email Spam Classifier
Calculates Accuracy, Precision, Recall, F1-Score, Confusion Matrix,
and exports trained model parameters for rapid web inference.
"""

import json
import random
import os
from model import NaiveBayesClassifier

def load_dataset(filepath: str):
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    texts = [f"{item['subject']} {item['body']}" for item in data]
    labels = [item['label'] for item in data]
    return texts, labels

def evaluate(model: NaiveBayesClassifier, test_texts, test_labels):
    tp = 0  # True Spam
    tn = 0  # True Ham
    fp = 0  # False Spam (Ham predicted as Spam)
    fn = 0  # False Ham (Spam predicted as Ham)

    predictions = []
    for text, label in zip(test_texts, test_labels):
        pred = model.predict(text)
        predictions.append(pred)
        if label == 'spam' and pred == 'spam':
            tp += 1
        elif label == 'ham' and pred == 'ham':
            tn += 1
        elif label == 'ham' and pred == 'spam':
            fp += 1
        elif label == 'spam' and pred == 'ham':
            fn += 1

    total = len(test_labels)
    accuracy = (tp + tn) / total if total > 0 else 0.0
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1 = (2 * precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0

    return {
        'total_tested': total,
        'accuracy': round(accuracy * 100, 2),
        'precision': round(precision * 100, 2),
        'recall': round(recall * 100, 2),
        'f1_score': round(f1 * 100, 2),
        'confusion_matrix': {
            'true_spam': tp,
            'true_ham': tn,
            'false_spam': fp,
            'false_ham': fn
        }
    }

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(base_dir, 'data', 'spam_dataset.json')
    vocab_export_path = os.path.join(base_dir, 'data', 'vocabulary.json')

    print("=" * 60)
    print("Training Naive Bayes Email Spam Classifier")
    print("=" * 60)

    texts, labels = load_dataset(dataset_path)
    print(f"Loaded {len(texts)} samples ({labels.count('ham')} Ham, {labels.count('spam')} Spam)")

    # Shuffle with fixed seed for reproducibility
    combined = list(zip(texts, labels))
    random.seed(42)
    random.shuffle(combined)
    texts, labels = zip(*combined)

    # Train / Test split (80/20)
    split_idx = int(len(texts) * 0.8)
    train_texts, train_labels = texts[:split_idx], labels[:split_idx]
    test_texts, test_labels = texts[split_idx:], labels[split_idx:]

    print(f"Split: {len(train_texts)} Training samples, {len(test_texts)} Testing samples")

    # Fit Model
    clf = NaiveBayesClassifier(alpha=1.0)
    clf.fit(train_texts, train_labels)

    # Evaluate
    metrics = evaluate(clf, test_texts, test_labels)

    print("\n--- Evaluation Metrics on Test Set ---")
    print(f"Accuracy:    {metrics['accuracy']}%")
    print(f"Precision:   {metrics['precision']}%")
    print(f"Recall:      {metrics['recall']}%")
    print(f"F1-Score:    {metrics['f1_score']}%")
    print("\nConfusion Matrix:")
    print(f"  [True Ham:  {metrics['confusion_matrix']['true_ham']} | False Spam: {metrics['confusion_matrix']['false_spam']}]")
    print(f"  [False Ham: {metrics['confusion_matrix']['false_ham']} | True Spam:  {metrics['confusion_matrix']['true_spam']}]")

    # Train on Full Dataset for final deployment
    clf_full = NaiveBayesClassifier(alpha=1.0)
    clf_full.fit(texts, labels)
    clf_full.save_json(vocab_export_path)

    print(f"\nFinal model fitted on all {len(texts)} samples and saved to:")
    print(f"  -> {vocab_export_path}")
    print(f"Vocabulary Size: {len(clf_full.vocab)} unique words")
    print("=" * 60)

if __name__ == '__main__':
    main()
