# Currently inactive
# For data and understanding purposes

# train_model.py

import os
import librosa
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, precision_recall_curve
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
from tqdm import tqdm

# Constants
MAX_LEN = 130
LABELS = {'real': 0, 'fake': 1}
MODEL_PATH = "voice_classifier_ai_or_human.pkl"
SCALER_PATH = "scaler.pkl"
RANDOM_SEED = 42
CUSTOM_THRESHOLD = 0.3  # You can adjust this

def extract_features(file_path, max_len=MAX_LEN):
    try:
        audio, sr = librosa.load(file_path, sr=None)
        mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=40)
        if mfcc.shape[1] < max_len:
            pad_width = max_len - mfcc.shape[1]
            mfcc = np.pad(mfcc, pad_width=((0, 0), (0, pad_width)), mode='constant')
        else:
            mfcc = mfcc[:, :max_len]
        return mfcc
    except Exception as e:
        print(f"Failed to process {file_path}: {e}")
        return None

def load_data(folder_path):
    print(f"\nLoading data from: {folder_path}")
    X, y = [], []
    for label_name in ['real', 'fake']:
        class_folder = os.path.join(folder_path, label_name)
        if not os.path.isdir(class_folder):
            print(f"Warning: {class_folder} not found.")
            continue
        files = [f for f in os.listdir(class_folder) if f.endswith('.wav') or f.endswith('.mp3')]
        print(f"Processing '{label_name}' files ({len(files)} files)...")
        for file in tqdm(files, desc=f"  - {label_name}"):
            full_path = os.path.join(class_folder, file)
            features = extract_features(full_path)
            if features is not None:
                X.append(features)
                y.append(LABELS[label_name])
    return np.array(X), np.array(y)

def plot_precision_recall(y_true, y_proba):
    precision, recall, thresholds = precision_recall_curve(y_true, y_proba)
    plt.plot(thresholds, precision[:-1], label='Precision')
    plt.plot(thresholds, recall[:-1], label='Recall')
    plt.xlabel('Threshold')
    plt.ylabel('Score')
    plt.title('Precision vs Recall for AI Class')
    plt.grid(True)
    plt.legend()
    plt.show()

def train_model():
    print("\nStarting training process...")

    # Load data
    X_train, y_train = load_data("training")
    X_val, y_val = load_data("validation")
    X_test, y_test = load_data("testing")

    # Reshape
    print("\nReshaping feature arrays...")
    X_train = X_train.reshape(len(X_train), -1)
    X_val = X_val.reshape(len(X_val), -1)
    X_test = X_test.reshape(len(X_test), -1)

    # Normalize
    print("\nNormalizing features...")
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_val = scaler.transform(X_val)
    X_test = scaler.transform(X_test)

    # Train model
    print("\nTraining Random Forest model...")
    model = RandomForestClassifier(random_state=RANDOM_SEED)
    model.fit(X_train, y_train)

    # Save model and scaler
    print(f"\nSaving model to: {MODEL_PATH}")
    joblib.dump(model, MODEL_PATH)
    print(f"Saving scaler to: {SCALER_PATH}")
    joblib.dump(scaler, SCALER_PATH)

    # Evaluate using default threshold
    print("\n=== Test Results (Default Threshold: 0.5) ===")
    y_pred_default = model.predict(X_test)
    print(classification_report(y_test, y_pred_default, target_names=["Human", "AI"]))

    # Evaluate using custom threshold
    print(f"\n=== Test Results (Custom Threshold: {CUSTOM_THRESHOLD}) ===")
    y_proba = model.predict_proba(X_test)
    y_pred_custom = (y_proba[:, 1] >= CUSTOM_THRESHOLD).astype(int)
    print(classification_report(y_test, y_pred_custom, target_names=["Human", "AI"]))

    # Plot precision vs recall curve
    print("\nPlotting precision-recall curve...")
    plot_precision_recall(y_test, y_proba[:, 1])

if __name__ == "__main__":
    train_model()
    print("\nTraining completed, model and scaler saved.")
