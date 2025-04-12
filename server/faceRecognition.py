import face_recognition
import cv2

def is_john_present(john_image_path="john.png"):
    # Load and encode the reference image
    john_image = face_recognition.load_image_file(john_image_path)
    john_encoding = face_recognition.face_encodings(john_image)
    
    if not john_encoding:
        print("No face found in john.png.")
        return False
    
    john_encoding = john_encoding[0]

    # Start webcam
    video_capture = cv2.VideoCapture(0)
    ret, frame = video_capture.read()
    video_capture.release()

    if not ret:
        print("Failed to capture image from camera.")
        return False

    # Find faces in the webcam frame
    face_locations = face_recognition.face_locations(frame)
    face_encodings = face_recognition.face_encodings(frame, face_locations)

    for face_encoding in face_encodings:
        # Compare to John's face
        matches = face_recognition.compare_faces([john_encoding], face_encoding)
        if True in matches:
            return True

    return False

print(is_john_present())