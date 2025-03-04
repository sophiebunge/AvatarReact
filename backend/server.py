import os
os.environ["IMAGEIO_FFMPEG_EXE"] = "/usr/bin/ffmpeg"
from flask import Flask, request, jsonify, Response # Import Flask for creating API endpoints
from fer import FER  # Import FER for emotion detection
import cv2  # OpenCV for image and video processing
import numpy as np  # NumPy for handling image arrays


app = Flask(__name__)
detector = FER()  # Initialize the FER emotion detector

# Load OpenCV's pre-trained face detection model (Haar Cascade)
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# API to process and detect emotions in static images
@app.route('/upload', methods=['POST'])
def upload_image():
    # Check if a file is provided in the request
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']  # Get the file from the request
    if file.filename == '':  # Check if a file was actually selected
        return jsonify({'error': 'No selected file'}), 400

    # Read the image bytes and convert it to a NumPy array
    img_bytes = file.read()
    np_img = np.frombuffer(img_bytes, np.uint8)
    image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)  # Decode the image using OpenCV

    if image is None:  # If image decoding fails
        return jsonify({'error': 'Invalid image'}), 400

    # Use the FER detector to detect the top emotion in the image
    emotion, score = detector.top_emotion(image)

    # Return the detected emotion and confidence score as JSON
    return jsonify({'emotion': emotion, 'score': score})

@app.route('/video_feed')
def video_feed():
    def generate_frames():
        cap = cv2.VideoCapture(0)  # Open the default camera (0)
        frame_interval = 5  # Process every 5th frame for face detection and emotion recognition
        frame_count = 0

        while True:
            success, frame = cap.read()
            if not success:
                break

            # Skip frames to speed up processing
            frame_count += 1
            if frame_count % frame_interval != 0:
                continue

            # Convert the frame to grayscale for face detection
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(
                gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30)
            )

            # Detect the top emotion for the current frame
            emotion, score = detector.top_emotion(frame)

            # Draw a rectangle around faces and annotate the emotion
            for (x, y, w, h) in faces:
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                cv2.putText(
                    frame, f'Emotion: {emotion}', (x, y - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2
                )

            # Resize frame for better performance (optional)
            resized_frame = cv2.resize(frame, (640, 480))

            # Encode the frame to JPEG
            ret, buffer = cv2.imencode('.jpg', resized_frame)
            frame = buffer.tobytes()

            # Yield the frame as part of the multipart response
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

        cap.release()  # Release the video capture

    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


# Start the Flask app on the specified port and IP address
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
