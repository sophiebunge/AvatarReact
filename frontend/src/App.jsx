import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const App = () => {
  const [emotion, setEmotion] = useState('Detecting...');
  const webcamRef = useRef(null);

  const captureAndSendImage = async () => {
    const imageSrc = webcamRef.current.getScreenshot();  // Capture webcam image

    try {
      // Send the captured image to the Flask backend for emotion recognition
      const response = await axios.post('http://localhost:3000/emotion', {
        image: imageSrc,  // Send image as base64
      });

      if (response.data.emotion) {
        setEmotion(response.data.emotion);
      }
    } catch (error) {
      console.error('Error sending image to backend', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(captureAndSendImage, 1000); // Capture image every second
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
      <h1>Emotion: {emotion}</h1>
    </div>
  );
};

export default App;