import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EmotionCapture() {
  const [emotion, setEmotion] = useState('');
  const [score, setScore] = useState(0);
  const [videoStream, setVideoStream] = useState(null);

  useEffect(() => {
    // Get available media devices and select the camera
    const getCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        // Find the first video device that's not a mobile camera (you may want to refine this logic)
        const laptopCamera = videoDevices.find(device => !device.deviceId.includes('mobile'));
        if (laptopCamera) {
          // Request the stream from the selected camera
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: laptopCamera.deviceId }
          });

          // Set the video stream to display the video feed
          setVideoStream(stream);
        } else {
          console.log('No camera found!');
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    getCamera();

    // Call Flask server to stream video
    const interval = setInterval(async () => {
      try {
        // Fetch emotion data from the server or process video frame
        const response = await axios.get('http://localhost:3000/video_feed', { responseType: 'arraybuffer' });

        // Assuming the server sends emotion data in the response
        const frameData = new Uint8Array(response.data); // Convert arraybuffer to Uint8Array
        const emotionData = JSON.parse(new TextDecoder().decode(frameData)); // Decode and parse JSON

        // Set emotion based on the backend response
        setEmotion(emotionData.emotion);
        setScore(emotionData.score);
      } catch (error) {
        console.error('Error fetching emotion data', error);
      }
    }, 1000); // Adjust the interval as needed

    return () => {
      if (videoStream) {
        // Cleanup: stop video stream when component unmounts
        videoStream.getTracks().forEach(track => track.stop());
      }
      clearInterval(interval); // Cleanup interval on component unmount
    };
  }, [videoStream]);

  return (
    <div>
      <h1>Emotion: {emotion}</h1>
      <h2>Score: {score}</h2>
      {videoStream && <video autoPlay muted playsInline ref={(video) => video && (video.srcObject = videoStream)} />}
    </div>
  );
}

export default EmotionCapture;
