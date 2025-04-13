from flask import Flask, jsonify,request
from flask_cors import CORS
from flask_socketio import SocketIO
import sqlite3
from contextlib import closing
from same_voice import same_voice
import os
from pydub import AudioSegment
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
DATABASE = 'users.db'


# Initialize SpeechBrain (only once when server starts)
try:
    recognizer = SpeakerRecognition.from_hparams(
        source="speechbrain/spkrec-ecapa-voxceleb",
        savedir="pretrained_models/spkrec-ecapa-voxceleb"
    )
    print("SpeechBrain model loaded successfully")
except Exception as e:
    print(f"Error loading SpeechBrain: {str(e)}")
    recognizer = None

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def get_latest_verification():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users ORDER BY rowid DESC LIMIT 1")
    record = cursor.fetchone()
    conn.close()
    return record


@app.route('/userform', methods=['POST'])
def handle_userform():
    data = request.get_json()
    print(f"Received form data: {data}")  # Debug log
    
    try:
        # Use ACTUAL verification results from frontend
        verification_data = {
            'first_name': data['first_name'] == 'John',
            'middle_initial': data['middle_initial'] == 'D',
            'last_name': data['last_name'] == 'Doe',
            'last_four_digits': data['last_four_digits'] == '1234',
            'zip_code': data['zip_code'] == '12345',
            'human_voice': data.get('human_voice', False),  # Get from request
            'matching_voice': data.get('matching_voice', False),  # Get from request
            'matching_face': data.get('matching_face', False)
        }

        with closing(get_db()) as conn:
            conn.execute('''
                INSERT INTO users 
                (first_name, middle_initial, last_name, last_four_digits, zip_code,
                 human_voice, matching_voice, matching_face)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                int(verification_data['first_name']),
                int(verification_data['middle_initial']),
                int(verification_data['last_name']),
                int(verification_data['last_four_digits']),
                int(verification_data['zip_code']),
                int(verification_data['human_voice']),  # Actual value
                int(verification_data['matching_voice']),  # Actual value
                int(verification_data['matching_face'])
            ))
            conn.commit()
        
        # Emit ACTUAL verification status
        socketio.emit('verification_update', verification_data)
        
        return jsonify({
            'message': 'Data saved successfully',
            'verification_status': verification_data
        })

    except Exception as e:
        print(f"Error saving user form: {str(e)}")  # Detailed error logging
        return jsonify({'error': str(e)}), 500

@app.route('/admin/dashboard')
def admin_dashboard():
    record = get_latest_verification()
    if not record:
        return jsonify({"error": "No records found"}), 404
    
    return jsonify(dict(record))

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    # Send current state immediately on connection
    record = get_latest_verification()
    if record:
        socketio.emit('verification_update', dict(record))

@app.route("/verify-voice", methods=["POST"])
def verify_voice():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file received"}), 400

    audio_file = request.files["audio"]
    filename = secure_filename(audio_file.filename)
    raw_path = os.path.join(UPLOAD_FOLDER, filename)
    wav_path = os.path.join(UPLOAD_FOLDER, "converted.wav")

    try:
        # Save raw upload
        audio_file.save(raw_path)

        # Convert to proper wav format (16-bit PCM, mono)
        sound = AudioSegment.from_file(raw_path)
        sound = sound.set_channels(1).set_frame_rate(16000)
        sound.export(wav_path, format="wav")

        # Run voice verification
        is_match = same_voice(wav_path)

        return jsonify({"is_match": is_match})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up
        if os.path.exists(raw_path): os.remove(raw_path)
        if os.path.exists(wav_path): os.remove(wav_path)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5001, debug=True)