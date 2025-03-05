import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import AvatarViewer from './Avatar';

const App = () => {
  const [emotion, setEmotion] = useState('Detecting...');
  const webcamRef = useRef(null);
  const avatarURL = 'https://models.readyplayer.me/64a12345.glb'; // Replace with your Ready Player Me GLB URL

  const captureAndSendImage = async () => {
    const imageSrc = webcamRef.current.getScreenshot();

    try {
      const response = await axios.post('http://localhost:3000/emotion', {
        image: imageSrc,
      });

      if (response.data.emotion) {
        setEmotion(response.data.emotion);
      }
    } catch (error) {
      console.error('Error sending image to backend', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(captureAndSendImage, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      <h1>Emotion: {emotion}</h1>
      <AvatarViewer avatarUrl={avatarURL} />
    </div>
  );
};

export default App;
