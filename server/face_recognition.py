import face_recognition
import cv2
import numpy as np
import os

def load_image(image_path):
    # Load an image from file
    image = face_recognition.load_image_file(image_path)
    return image

def get_face_encoding(image):
    # Find all face encodings in the image
    face_encoding = face_recognition.face_encodings(image)
    
    if len(face_encoding) > 0:
        return face_encoding[0]  # Return the first face encoding
    else:
        raise ValueError("No faces found in the image.")

def compare_faces(known_encoding, unknown_encoding):
    # Compare the known face encoding with the unknown encoding
    results = face_recognition.compare_faces([known_encoding], unknown_encoding)
    return results[0]

def test_face_recognition(image1_path, image2_path):
    try:
        # Load images
        image1 = load_image(image1_path)
        image2 = load_image(image2_path)

        # Get face encodings
        encoding1 = get_face_encoding(image1)
        encoding2 = get_face_encoding(image2)

        # Compare the faces
        match = compare_faces(encoding1, encoding2)

        # Print result
        if match:
            print(f"Faces match! Both images belong to the same person.")
        else:
            print(f"Faces do not match. These images belong to different people.")
    
    except Exception as e:
        print(f"Error during face recognition: {str(e)}")

if __name__ == '__main__':
    # Path to the image files you want to compare
    image1_path = "image1.jpg"  # Replace with the path to the first image
    image2_path = "image2.jpg"  # Replace with the path to the second image

    # Test the face recognition
    test_face_recognition(image1_path, image2_path)
