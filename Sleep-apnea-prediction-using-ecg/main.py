"""
Sleep Apnea Detection - Model Training Script

This script trains and compares multiple machine learning models for sleep apnea detection
using ECG signals from the PhysioNet Apnea-ECG Database.
"""

import os
import warnings

import numpy as np
import wfdb
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

warnings.filterwarnings('ignore')

# ============================================================================
# CONFIGURATION PARAMETERS
# ============================================================================
DATA_FOLDER = 'apnea-ecg-database-1.0.0'
WINDOW_SECONDS = 30
OVERLAP = 0.5

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def get_apnea_symbols(annotation):
    """Extract apnea symbols from annotation, excluding normal and unlabeled."""
    return set(annotation.symbol) - set(['0', 'N'])


def extract_simple_features(window):
    """
    Extract 12 statistical features from ECG window.
    
    Args:
        window: 1D array of ECG signal values
        
    Returns:
        numpy array of 12 features
    """
    features = []
    
    # Time domain features
    features.append(np.mean(window))
    features.append(np.std(window))
    features.append(np.min(window))
    features.append(np.max(window))
    features.append(np.median(window))
    features.append(np.percentile(window, 25))
    features.append(np.percentile(window, 75))
    
    # Signal energy
    features.append(np.sum(window**2))
    features.append(np.sqrt(np.mean(window**2)))  # RMS
    
    # Zero crossing rate
    zero_crossings = np.sum(np.diff(np.signbit(window)))
    features.append(zero_crossings)
    
    # Heart rate variability approximation
    diff = np.diff(window)
    features.append(np.std(diff))
    features.append(np.mean(np.abs(diff)))
    
    return np.array(features)

# ============================================================================
# DATA LOADING AND PROCESSING
# ============================================================================
if __name__ == "__main__":
    print("Loading and processing recordings with feature extraction...")
    print("=" * 80)
    
    X_features = []
    y_labels = []
    processed_files = 0
    
    for file in os.listdir(DATA_FOLDER):
        if file.endswith('.dat') and not file.endswith('er.dat'):
            basename = file[:-4]
            dat_path = os.path.join(DATA_FOLDER, basename)
            apn_path = os.path.join(DATA_FOLDER, basename + '.apn')
            
            if not os.path.exists(apn_path):
                continue
    
            try:
                # Load ECG and annotation
                record = wfdb.rdrecord(dat_path)
                annotation = wfdb.rdann(dat_path, 'apn')
                
                ecg = record.p_signal[:, 0]
                fs = int(record.fs)
                
                # Create apnea array
                apnea_symbols = get_apnea_symbols(annotation)
                apnea_array = np.zeros(len(ecg))
                apnea_count = 0
                for idx, symbol in zip(annotation.sample, annotation.symbol):
                    if symbol in apnea_symbols:
                        apnea_array[idx] = 1
                        apnea_count += 1
                
                if apnea_count == 0:
                    continue
                    
                print(f"Processing {basename} - Found {apnea_count} apnea events")
    
                # Create windows and extract features
                window_size = int(WINDOW_SECONDS * fs)
                step_size = int(window_size * (1 - OVERLAP))
                
                apnea_windows = 0
                total_windows = 0
                
                for start in range(0, len(ecg) - window_size, step_size):
                    end = start + window_size
                    window = ecg[start:end]
                    label_window = apnea_array[start:end]
                    
                    # Skip windows with NaN values
                    if np.any(np.isnan(window)):
                        continue
                    
                    # Label window
                    label = 1 if np.sum(label_window) > 0 else 0
                    
                    # Extract features instead of raw signal
                    features = extract_simple_features(window)
                    
                    X_features.append(features)
                    y_labels.append(label)
                    
                    if label == 1:
                        apnea_windows += 1
                    total_windows += 1
                
                print(f"  Created {total_windows} windows, {apnea_windows} with apnea ({apnea_windows/total_windows*100:.1f}%)")
                processed_files += 1
                
            except Exception as e:
                print(f"Error processing {basename}: {e}")
                continue
    
    X_features = np.array(X_features)
    y_labels = np.array(y_labels)
    
    print(f"\nDataset Summary:")
    print(f"Processed files: {processed_files}")
    print(f"Total samples: {X_features.shape}")
    print(f"Feature dimension: {X_features.shape[1]}")
    print(f"Apnea samples: {np.sum(y_labels)} ({np.sum(y_labels)/len(y_labels)*100:.1f}%)")
    print(f"Normal samples: {len(y_labels)-np.sum(y_labels)} ({(len(y_labels)-np.sum(y_labels))/len(y_labels)*100:.1f}%)")
    
    # ========================================================================
    # FEATURE SCALING
    # ========================================================================
    print("\n" + "=" * 80)
    print("SCALING FEATURES")
    print("=" * 80)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_features)
    
    # ========================================================================
    # TRAIN-TEST SPLIT
    # ========================================================================
    print("\n" + "=" * 80)
    print("SPLITTING DATA")
    print("=" * 80)
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y_labels, test_size=0.2, random_state=42, stratify=y_labels
    )
    
    print(f"Training set: {X_train.shape}")
    print(f"Test set: {X_test.shape}")
    
    # ========================================================================
    # MODEL TRAINING AND COMPARISON
    # ========================================================================
    models = {
        'Random Forest': RandomForestClassifier(
            n_estimators=100, 
            random_state=42, 
            class_weight='balanced'
        ),
        'SVM': SVC(
            kernel='rbf', 
            random_state=42, 
            class_weight='balanced'
        ),
        'Logistic Regression': LogisticRegression(
            random_state=42, 
            class_weight='balanced', 
            max_iter=1000
        ),
        'Neural Network': MLPClassifier(
            hidden_layer_sizes=(64, 32),
            activation='relu',
            solver='adam',
            alpha=0.001,
            batch_size=32,
            learning_rate='adaptive',
            max_iter=1000,
            early_stopping=True,
            validation_fraction=0.1,
            n_iter_no_change=10,
            random_state=42
        )
    }
    
    print("\n" + "=" * 80)
    print("COMPARING MULTIPLE MODELS FOR SLEEP APNEA DETECTION")
    print("=" * 80)
    
    best_model = None
    best_score = 0
    results = {}
    
    for name, model in models.items():
        print(f"\nTraining {name}...")
        
        # Train model
        model.fit(X_train, y_train)
        
        # Evaluate
        train_acc = model.score(X_train, y_train)
        test_acc = model.score(X_test, y_test)
        
        # Predictions
        y_pred = model.predict(X_test)
        
        # Calculate metrics
        cm = confusion_matrix(y_test, y_pred)
        if cm.shape == (2, 2):
            tn, fp, fn, tp = cm.ravel()
            precision = tp / (tp + fp) if (tp + fp) > 0 else 0
            recall = tp / (tp + fn) if (tp + fn) > 0 else 0
            f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
            
            # ROC-AUC
            try:
                if hasattr(model, 'predict_proba'):
                    y_proba = model.predict_proba(X_test)[:, 1]
                    auc = roc_auc_score(y_test, y_proba)
                else:
                    auc = 0
            except:
                auc = 0
            
            results[name] = {
                'accuracy': test_acc,
                'precision': precision,
                'recall': recall,
                'f1': f1,
                'auc': auc,
                'tp': tp, 'fp': fp, 'fn': fn, 'tn': tn
            }
            
            print(f"{name} Results:")
            print(f"  Accuracy: {test_acc:.3f}")
            print(f"  Precision: {precision:.3f}")
            print(f"  Recall: {recall:.3f}")
            print(f"  F1-Score: {f1:.3f}")
            print(f"  ROC-AUC: {auc:.3f}")
            print(f"  Confusion Matrix: TP={tp}, FP={fp}, FN={fn}, TN={tn}")
            
            # Track best model based on F1 score
            if f1 > best_score:
                best_score = f1
                best_model = name
        else:
            print(f"{name}: Could not evaluate (single class)")
    
    # ========================================================================
    # RESULTS SUMMARY
    # ========================================================================
    print("\n" + "=" * 80)
    print("FINAL RESULTS SUMMARY")
    print("=" * 80)
    
    print(f"{'Model':<20} {'Accuracy':<10} {'Precision':<10} {'Recall':<10} {'F1-Score':<10} {'ROC-AUC':<10}")
    print("-" * 80)
    
    for name, metrics in results.items():
        print(f"{name:<20} {metrics['accuracy']:<10.3f} {metrics['precision']:<10.3f} "
              f"{metrics['recall']:<10.3f} {metrics['f1']:<10.3f} {metrics['auc']:<10.3f}")
    
    print(f"\nBest Model: {best_model} (F1-Score: {best_score:.3f})")
    
    # ========================================================================
    # DETAILED ANALYSIS
    # ========================================================================
    if best_model and best_model in results:
        best_metrics = results[best_model]
        print(f"\nDetailed Analysis of {best_model}:")
        print(f"  True Positives:  {best_metrics['tp']}")
        print(f"  False Positives: {best_metrics['fp']}")
        print(f"  False Negatives: {best_metrics['fn']}")
        print(f"  True Negatives:  {best_metrics['tn']}")
        
        if best_metrics['recall'] > 0.1:
            print("\nSUCCESS: Model can detect apnea events!")
        else:
            print("\nWARNING: Apnea detection still needs improvement")
    
    print("\n" + "=" * 80)
    print("RECOMMENDATIONS:")
    print("  1. Feature engineering is crucial for medical signal classification")
    print("  2. Class balancing helps with imbalanced datasets")
    print("  3. Multiple model comparison reveals the best approach")
    print("  4. Consider ensemble methods for better performance")
    print("=" * 80)