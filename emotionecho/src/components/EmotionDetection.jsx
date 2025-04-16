import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";

export default function EmotionDetector({ setMood }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [detectionComplete, setDetectionComplete] = useState(false);
  const prevEmotion = useRef("relaxed");

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      console.log("Models loaded successfully.");
      setLoading(false);
    };
    loadModels();
  }, []);

  const detectEmotion = async () => {
    if (!webcamRef.current || !webcamRef.current.video) {
      console.error("Webcam not ready!");
      return;
    }

    const video = webcamRef.current.video;
    if (video.readyState !== 4) {
      console.warn("Video not ready for processing!");
      return;
    }

    console.log("Starting emotion detection...");
    setLoading(true);
    let emotionCounts = {};

    for (let i = 0; i < 10; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const detections = await faceapi
        .detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections && detections.expressions) {
        let detectedEmotion = Object.entries(detections.expressions).reduce(
          (prev, curr) => (prev[1] > curr[1] ? prev : curr)
        )[0];

        console.log(`Detected emotion at frame ${i + 1}:`, detectedEmotion);
        emotionCounts[detectedEmotion] =
          (emotionCounts[detectedEmotion] || 0) + 1;
      }
    }

    console.log("Emotion counts:", emotionCounts);

    let majorityEmotion =
      Object.keys(emotionCounts).length > 0
        ? Object.keys(emotionCounts).reduce(
            (a, b) => (emotionCounts[a] > emotionCounts[b] ? a : b),
            "neutral"
          )
        : prevEmotion.current;

    console.log("Final detected majority emotion:", majorityEmotion);

    const moodMapping = {
      angry: ["angry", "disgusted"],
      happy: ["happy", "surprised"],
      relaxed: ["neutral"],
      sad: ["sad", "fearful"],
    };

    let finalMood = "relaxed";
    for (const [mood, emotions] of Object.entries(moodMapping)) {
      if (emotions.includes(majorityEmotion)) {
        finalMood = mood;
        break;
      }
    }

    console.log("Mapped Mood:", finalMood);

    prevEmotion.current = finalMood;
    setMood(finalMood);
    setLoading(false);
    setDetectionComplete(true);
  };

  useEffect(() => {
    setTimeout(detectEmotion, 2000);
  }, []);

  return (
    <div className="emotion-detector">
      {!detectionComplete && (
        <div className="webcam-container">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              width: 640,
              height: 480,
              facingMode: "user",
              frameRate: { ideal: 30, max: 60 },
            }}
            className="webcam"
          />
          {loading && (
            <div className="overlay">
              <p>Detecting Emotion...</p>
              <div className="spinner"></div>
            </div>
          )}
        </div>
      )}

      {!detectionComplete && (
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      )}
    </div>
  );
}
