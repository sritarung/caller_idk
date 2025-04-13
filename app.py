from flask import Flask, jsonify, render_template, request
import joblib
import librosa
import numpy as np
import os
from steganography.decoder import extract_ultrasonic_message
from steganography.encoder import embed_ultrasonic_message
from voice_classifier.voice_classifier import is_human

from flask import send_file
import tempfile

app = Flask(__name__)
clf = joblib.load('sound_classifier/sound_classifier.pkl')

def extract_features(file_path):
    y, sr = librosa.load(file_path, sr=None)
    mel = librosa.feature.melspectrogram(y=y, sr=sr)
    mel_db = librosa.power_to_db(mel, ref=np.max)
    return np.mean(mel_db, axis=1)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/embed_message', methods=['POST'])
def embed_message():
    audio = request.files['stegoAudio']
    message = request.form['stegoMessage']
    print(f"[ENCODE] Embedding message: {message}")

    temp_input = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
    audio.save(temp_input.name)

    temp_output = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
    temp_output.close()

    # Actually embed the message
    embed_ultrasonic_message(temp_input.name, message, temp_output.name)

    return send_file(temp_output.name, as_attachment=True, download_name='stego_output.wav', mimetype='audio/wav')

@app.route('/decode_message', methods=['POST'])
def decode_message_route():
    if 'decodeAudio' not in request.files:
        return jsonify({'error': 'Missing file'}), 400

    audio = request.files['decodeAudio']
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
    audio.save(temp_file.name)

    print(f"[DECODE] File received for decoding: {temp_file.name}")  # debug

    try:
        message = extract_ultrasonic_message(temp_file.name)
        print(f"[DECODE] Extracted message: {message}")  # debug
        if message:
            return jsonify({'message': message})
        else:
            return jsonify({'error': 'Could not decode message'}), 422
    finally:
        os.remove(temp_file.name)

@app.route('/classify_voice', methods=['POST'])
def classify_voice():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file uploaded'}), 400

    audio = request.files['audio']
    temp_path = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
    audio.save(temp_path.name)

    try:
        # Use your existing logic

        result = is_human(temp_path.name)
        if result is None:
            return jsonify({'error': 'Classification failed'}), 500

        # Reload model to get probability too
        from voice_classifier.voice_classifier import extract_features as extract_mfcc_features

        model = joblib.load("voice_classifier/voice_classifier.pkl")
        scaler = joblib.load("voice_classifier/scaler.pkl")
        features = extract_mfcc_features(temp_path.name)

        if features is None:
            return jsonify({'error': 'Feature extraction failed'}), 500

        features = features.reshape(1, -1)
        features = scaler.transform(features)
        proba = model.predict_proba(features)[0][1]  # AI confidence



        label = "Human" if result else "AI"
        return jsonify({'label': label, 'probability': f"{proba:.2f}"})
    except Exception as e:
        print(f"Voice classification error: {e}")
        return jsonify({'error': 'Server error'}), 500
    finally:
        os.remove(temp_path.name)


@app.route('/predict_sample', methods=['POST'])
def predict_sample():
    data = request.get_json()
    sample_name = data.get("sample")
    file_path = os.path.join("static", "samples", sample_name)

    if not os.path.exists(file_path):
        return jsonify({"error": "Sample file not found."}), 404

    try:
        features = extract_features(file_path).reshape(1, -1)
        prediction = clf.predict(features)[0]
        return jsonify({"prediction": prediction})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
