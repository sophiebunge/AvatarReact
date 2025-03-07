import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import AvatarViewer from './Avatar';
import './index.css';

const App = () => {
  const [emotion, setEmotion] = useState('happy');  // Default emotion is "happy"
  const webcamRef = useRef(null);
  const avatarURL = "https://models.readyplayer.me/67c73d86bf28c8a21e42e31a.glb?bodyType=halfbody";

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
      console.error('Error: sending image to backend', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(captureAndSendImage, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <div className="webcam-container">
        <Webcam ref={webcamRef} />
        <h2>Emotion: {emotion}</h2>
      </div>
      <div className="avatar">
        <AvatarViewer avatarUrl={avatarURL} currentEmotion={emotion} />
      </div>
    </div>
  );  
}

export default App;
