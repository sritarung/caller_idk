from flask import Flask, jsonify,request
from flask_cors import CORS
from flask_socketio import SocketIO
import sqlite3
from contextlib import closing

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

DATABASE = 'users.db'

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
    
    try:
        # Convert to verification booleans
        verification_data = {
            'first_name': data['first_name'] == 'John',
            'middle_initial': data['middle_initial'] == 'D',
            'last_name': data['last_name'] == 'Doe',
            'last_four_digits': data['last_four_digits'] == '1234',
            'zip_code': data['zip_code'] == '12345',
            'human_voice': False,  # As per requirements
            'matching_voice': False,
            'matching_face': False
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
                0, 0, 0  # Biometric fields
            ))
            conn.commit()
        
        # Emit to all connected dashboard clients
        socketio.emit('verification_update', verification_data)
        
        return jsonify({
            'message': 'Data saved successfully',
            'verification_status': verification_data
        })

    except Exception as e:
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

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5001, debug=True)