import librosa
import numpy as np
import joblib

MAX_LEN = 130
CUSTOM_THRESHOLD = 0.3
MODEL_PATH = "voice_classifier.pkl"
SCALER_PATH = "scaler.pkl"

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
        print(f"Error processing {file_path}: {e}")
        return None

def is_human(audio_file):
    try:
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
    except Exception as e:
        print(f"Failed to load model or scaler: {e}")
        return

    features = extract_features(audio_file)

    if features is None:
        print("Feature extraction failed.")
        return

    features = features.reshape(1, -1)

    features_normalized = scaler.transform(features)

    proba = model.predict_proba(features_normalized)
    ai_probability = proba[0][1]

    print(f"Probability for AI: {ai_probability:.2f}")
    label = "AI" if ai_probability >= CUSTOM_THRESHOLD else "Human"    
    print(f"Classification result: {label}")

    return True if label == "Human" else False

is_human("model.wav")