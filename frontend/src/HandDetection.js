import { useEffect, useRef, useState } from "react";
import axios from "axios";

const HandDetection = (props) => {
  // Helper: Normalizes a flattened landmark array for one hand (42 numbers).
  function normalizeLandmarks(flatLandmarks) {
    const x_vals = [];
    const y_vals = [];
    for (let i = 0; i < flatLandmarks.length; i += 2) {
      x_vals.push(flatLandmarks[i]);
      y_vals.push(flatLandmarks[i + 1]);
    }
    const minX = Math.min(...x_vals);
    const maxX = Math.max(...x_vals);
    const minY = Math.min(...y_vals);
    const maxY = Math.max(...y_vals);
    const rangeX = (maxX - minX) || 1;
    const rangeY = (maxY - minY) || 1;
    
    const normalized = [];
    for (let i = 0; i < flatLandmarks.length; i += 2) {
      const normX = (flatLandmarks[i] - minX) / rangeX;
      const normY = (flatLandmarks[i + 1] - minY) / rangeY;
      normalized.push(normX, normY);
    }
    return normalized;
  }

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  // We store the entire prediction as a single string.
  // const [prediction, setPrediction] = useState("");

  // Refs for buffering landmark data and counting frames with no hand.
  const landmarksBuffer = useRef([]);
  const noHandCounter = useRef(0);
  const NO_HAND_THRESHOLD = 15; // Adjust as needed

  // A flag to indicate whether the last appended token was mergeable (a letter).
  // true means the previous token was a letter; false means it was a word.
  const lastMergeable = useRef(true);

  const [isCameraStarted, setIsCameraStarted] = useState(false);
  const [showStartButton, setShowStartButton] = useState(true);

  // Define initializeMediaPipe at component level
  const initializeMediaPipe = () => {
    console.log("mpDrawing:", window.mpDrawing);
    console.log("mpHands:", window.mpHands);

    // Initialize MediaPipe Hands
    const hands = new window.Hands({
      locateFile: (file) => {
        console.log("Original file requested:", file);
        if (file.includes("hand_landmark_full.tflite")) {
          file = "hand_landmark_lite.tflite";
        }
        if (file.includes("simd_")) {
          file = file.replace(/simd_/g, "");
        }
        const newFile = `${file}?cacheBust=${Date.now()}`;
        console.log("Loading file:", newFile);
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${newFile}`;
      },
    });

    hands.setOptions({
      modelComplexity: 0,
      maxNumHands: 2,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6,
    });

    hands.onResults((results) => {
      console.log("onResults callback executed");
      
      // Draw on canvas
      if (canvasRef.current && results.image) {
        const ctx = canvasRef.current.getContext("2d");
        canvasRef.current.width = results.image.width;
        canvasRef.current.height = results.image.height;
        ctx.save();
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(results.image, 0, 0);
        if (results.multiHandLandmarks) {
          for (const landmarks of results.multiHandLandmarks) {
            if (window.mpDrawing && window.mpHands && window.mpHands.HAND_CONNECTIONS) {
              window.mpDrawing.drawConnectors(ctx, landmarks, window.mpHands.HAND_CONNECTIONS);
              window.mpDrawing.drawLandmarks(ctx, landmarks);
            }
          }
        }
        ctx.restore();
      }
      
      // Process landmark data
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        noHandCounter.current = 0;
        let landmarks = results.multiHandLandmarks[0]
          .map((lm) => [lm.x, lm.y])
          .flat();
        let normLandmarks = normalizeLandmarks(landmarks);
        if (normLandmarks.length === 42) {
          normLandmarks = normLandmarks.concat(Array(42).fill(0));
        }
        landmarksBuffer.current.push(normLandmarks);
      } else {
        noHandCounter.current += 1;
      }
      
      if (noHandCounter.current >= NO_HAND_THRESHOLD && landmarksBuffer.current.length > 0) {
        sendSequenceToBackend(landmarksBuffer.current);
        landmarksBuffer.current = [];
        noHandCounter.current = 0;
      }
    });

    // Initialize camera with error handling
    try {
      if (videoRef.current) {
        const camera = new window.Camera(videoRef.current, {
          onFrame: async () => {
            try {
              await hands.send({ image: videoRef.current });
            } catch (err) {
              console.error("Error in camera frame processing:", err);
            }
          },
          width: 640,
          height: 480,
        });
        camera.start()
          .catch(err => {
            console.error("Error starting camera:", err);
            if (props.onError) {
              props.onError("حدث خطأ في تشغيل الكاميرا. يرجى تحديث الصفحة والمحاولة مرة أخرى.");
            }
          });
      }
    } catch (err) {
      console.error("Error initializing camera:", err);
      if (props.onError) {
        props.onError("حدث خطأ في تهيئة الكاميرا. يرجى تحديث الصفحة والمحاولة مرة أخرى.");
      }
    }
  };

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
          frameRate: { ideal: 30 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          initializeMediaPipe();
          setIsCameraStarted(true);
          setShowStartButton(false);
        };
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      if (props.onError) {
        props.onError("حدث خطأ في الوصول إلى الكاميرا. يرجى التأكد من السماح بالوصول إلى الكاميرا في إعدادات المتصفح.");
      }
    }
  };

  useEffect(() => {
    // Check if we're on a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setShowStartButton(isMobile);

    // If not mobile, start camera automatically
    if (!isMobile) {
      startCamera();
    }
  }, []);

  const sendSequenceToBackend = async (sequence) => {
    console.log("Sending sequence to backend with", sequence.length, "frames.");
    try {
      const response = await axios.post("https://5771-197-59-153-78.ngrok-free.app/predict_sequence", { sequence });
      console.log("Received response:", response.data);
      const newToken = response.data.prediction;
      console.log("New token:", newToken);

      // Compute newFlag as before
      let newFlag;
      if (newToken.length === 1) {
        newFlag = lastMergeable.current ? true : true;
      } else {
        newFlag = false;
      }
      setTimeout(() => {
        lastMergeable.current = newFlag;
        console.log("Flag updated to:", newFlag);
      }, 0);

      // Send prediction up to parent
      if (typeof props.onPrediction === 'function') {
        props.onPrediction(newToken, lastMergeable.current);
      }

    } catch (error) {
      console.error("Error sending sequence:", error);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '500px',
        margin: '32px auto',
        padding: 0,
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '18px',
        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '375px', // 4:3 aspect ratio for 500px width
        aspectRatio: '4/3',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {showStartButton && (
        <button
          onClick={startCamera}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '12px 24px',
            backgroundColor: '#3a8dde',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            zIndex: 10,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          ابدأ الكاميرا
        </button>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '18px',
          margin: 0,
          background: 'transparent',
          objectFit: 'cover',
          display: 'block',
        }}
      />
    </div>
  );
};

export default HandDetection;