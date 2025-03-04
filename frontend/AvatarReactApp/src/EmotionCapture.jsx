import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EmotionCapture() {
  const [emotion, setEmotion] = useState('');
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Call Flask server to stream video
    const interval = setInterval(async () => {
      try {
        // Fetch emotion data from the server or process video frame
        const response = await axios.get('http://localhost:3000/video_feed', { responseType: 'arraybuffer' });

        // Set emotion based on the backend response (you would need to tweak this for real-time)
        // Here, we'll assume the server sends emotion data, but you need to adapt your Flask code
        setEmotion(response.data.emotion);
        setScore(response.data.score);
      } catch (error) {
        console.error('Error fetching emotion data', error);
      }
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div>
      <h1>Emotion: {emotion}</h1>
      <h2>Confidence: {score}</h2>
      <img
        src={`data:image/jpeg;base64,${frameData}`} // Assuming you send base64 image stream
        alt="Emotion detection"
      />
    </div>
  );
}

export default EmotionCapture;
