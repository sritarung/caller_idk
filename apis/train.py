# train_classifier.py
import os
import librosa
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from tqdm import tqdm

# Folder containing category subfolders with .wav files
data_dir = '/Users/pragyamtiwari/Downloads/segregated-urban8K-sounds'
labels = [label for label in os.listdir(data_dir) if os.path.isdir(os.path.join(data_dir, label))]

# Function to extract features from a .wav file
def extract_features(file_path):
    y, sr = librosa.load(file_path, sr=None)
    mel = librosa.feature.melspectrogram(y=y, sr=sr)
    mel_db = librosa.power_to_db(mel, ref=np.max)
    return np.mean(mel_db, axis=1)

# Load features and labels with progress bar
X, y = [], []
print("🎧 Extracting features from audio files...")

for label in tqdm(labels, desc="🔍 Processing labels"):
    folder = os.path.join(data_dir, label)
    files = [file for file in os.listdir(folder) if file.endswith('.wav')]
    for file in tqdm(files, desc=f"📁 {label}", leave=False):
        path = os.path.join(folder, file)
        try:
            features = extract_features(path)
            X.append(features)
            y.append(label)
        except Exception as e:
            tqdm.write(f"⚠️ Skipping {path}: {e}")

X = np.array(X)
y = np.array(y)

# Train-test split
print("🧪 Splitting dataset...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train classifier
print("🌲 Training RandomForest classifier...")
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

# Save model
joblib.dump(clf, 'sound_classifier.pkl')
print("✅ Model saved as sound_classifier.pkl")

# Evaluate model
print("\n📊 Classification Report:")
y_pred = clf.predict(X_test)
print(classification_report(y_test, y_pred))
print("📈 Evaluation complete.")