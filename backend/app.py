from flask import Flask, request, jsonify
from flask_cors import CORS
from fer import FER
import cv2
import numpy as np
import base64
import os

app = Flask(__name__)

# Allow CORS only for your frontend
CORS(app, resources={r"/emotion": {"origins": "https://avatarreact-2.onrender.com"}})

detector = FER()

@app.route('/emotion', methods=['POST'])
def detect_emotion():
    try:
        data = request.json
        image_data = data['image']
        image_data = base64.b64decode(image_data.split(',')[1])
        np_arr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        emotion, score = detector.top_emotion(img)
        return jsonify({'emotion': emotion, 'score': score})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
