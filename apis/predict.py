# predict_sound.py
import joblib
import librosa
import numpy as np

# 🛠️ Set your WAV file path here
file_path = 'silence.wav'

# Load the trained model
clf = joblib.load('sound_classifier.pkl')

# Feature extraction function
def extract_features(file_path):
    y, sr = librosa.load(file_path, sr=None)
    mel = librosa.feature.melspectrogram(y=y, sr=sr)
    mel_db = librosa.power_to_db(mel, ref=np.max)
    return np.mean(mel_db, axis=1)

# Run prediction
try:
    features = extract_features(file_path).reshape(1, -1)
    prediction = clf.predict(features)[0]
    print(f"🔊 Predicted label: {prediction}")
except Exception as e:
    print(f"❌ Error processing file: {e}")
