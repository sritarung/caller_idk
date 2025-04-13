import cv2
import face_recognition
import time

def get_face_encoding(image_path):
    image = face_recognition.load_image_file(image_path)
    encodings = face_recognition.face_encodings(image)
    if not encodings:
        print("No face found in reference image.")
        return None
    return encodings[0]

def is_face_in_video(ref_image_path, duration=5):
    ref_encoding = get_face_encoding(ref_image_path)
    if ref_encoding is None:
        return False

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Cannot access webcam.")
        return False

    start_time = time.time()
    found = False

    while time.time() - start_time < duration:
        ret, frame = cap.read()
        if not ret:
            break

        # Resize frame for faster processing
        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
        rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

        for encoding in face_encodings:
            match = face_recognition.compare_faces([ref_encoding], encoding, tolerance=0.5)
            if match[0]:
                found = True
                break

        cv2.imshow('Webcam', frame)
        if cv2.waitKey(1) & 0xFF == 27 or found:
            break

    cap.release()
    cv2.destroyAllWindows()
    return found

print(is_face_in_video("pragyam.jpeg"))
