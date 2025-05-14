import { useEffect, useRef, useState } from "react";
import axios from "axios";

const HandDetection = () => {
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
  const [prediction, setPrediction] = useState("");

  // Refs for buffering landmark data and counting frames with no hand.
  const landmarksBuffer = useRef([]);
  const noHandCounter = useRef(0);
  const NO_HAND_THRESHOLD = 15; // Adjust as needed

  // A flag to indicate whether the last appended token was mergeable (a letter).
  // true means the previous token was a letter; false means it was a word.
  const lastMergeable = useRef(true);

  useEffect(() => {
    console.log("mpDrawing:", window.mpDrawing);
    console.log("mpHands:", window.mpHands);

    // Request webcam access.
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });

    // Initialize MediaPipe Hands.
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
      modelComplexity: 0, // Using the lite model.
      maxNumHands: 2,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6,
    });

    hands.onResults((results) => {
      console.log("onResults callback executed");
      
      // Draw on canvas.
      if (canvasRef.current && results.image) {
        const ctx = canvasRef.current.getContext("2d");
        canvasRef.current.width  = results.image.width;
        canvasRef.current.height = results.image.height;
        ctx.save();
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(results.image, 0, 0);
        if (results.multiHandLandmarks) {
          for (const landmarks of results.multiHandLandmarks) {
            if (
              window.mpDrawing &&
              window.mpHands &&
              window.mpHands.HAND_CONNECTIONS
            ) {
              window.mpDrawing.drawConnectors(ctx, landmarks, window.mpHands.HAND_CONNECTIONS);
              window.mpDrawing.drawLandmarks(ctx, landmarks);
            } else {
              console.warn("mpDrawing is not available yet");
            }
          }
        }
        ctx.restore();
      }
      
      // Process landmark data:
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        noHandCounter.current = 0;
        let landmarks = results.multiHandLandmarks[0]
          .map((lm) => [lm.x, lm.y])
          .flat();
        console.log("Raw landmarks length:", landmarks.length);
        let normLandmarks = normalizeLandmarks(landmarks);
        // If only one hand is detected, pad with zeros.
        if (normLandmarks.length === 42) {
          normLandmarks = normLandmarks.concat(Array(42).fill(0));
        }
        landmarksBuffer.current.push(normLandmarks);
      } else {
        noHandCounter.current += 1;
      }
      
      // When no hand is detected for enough frames, send the buffered sequence.
      if (noHandCounter.current >= NO_HAND_THRESHOLD && landmarksBuffer.current.length > 0) {
        sendSequenceToBackend(landmarksBuffer.current);
        landmarksBuffer.current = [];
        noHandCounter.current = 0;
      }
    });

    let camera;
    if (videoRef.current) {
      camera = new window.Camera(videoRef.current, {
        onFrame: async () => {
          await hands.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
    
    return () => {
      if (camera && camera.stop) {
        camera.stop();
      }
    };
  }, []);

  const sendSequenceToBackend = async (sequence) => {
    console.log("Sending sequence to backend with", sequence.length, "frames.");
    try {
      const response = await axios.post("https://4708-197-59-153-78.ngrok-free.app/predict_sequence", { sequence });
      console.log("Received response:", response.data);
      const newToken = response.data.prediction;
      console.log("New token:", newToken);
      
    setPrediction((prev) => {
    let newPrediction;
    let newFlag; // compute what the new flag should be
    if (newToken.length === 1) {
        if (prev === "") {
        newPrediction = newToken;
        newFlag = true;
        } else if (lastMergeable.current) {
        // Merge the letter with the previously displayed letters
        newPrediction = prev + newToken;
        newFlag = true;
        } else {
        // Previous token was a word, so add a visible space before this letter.
        newPrediction = prev + " " + newToken;
        newFlag = true;
        }
    } else {
        // For a full word, always add it with a space if needed.
        newPrediction = prev ? prev + " " + newToken : newToken;
        newFlag = false;
    }
    // Delay the flag update so that it occurs *after* the state is updated.
    setTimeout(() => {
        lastMergeable.current = newFlag;
        console.log("Flag updated to:", newFlag);
    }, 0);

    console.log("New token:", newToken, "New prediction:", newPrediction);
    return newPrediction;
    });


    } catch (error) {
      console.error("Error sending sequence:", error);
    }
  };

  return (
    <div>
      <h1>Live Hand Detection</h1>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: "500px", border: "2px solid black" }}
      />
      <canvas
        ref={canvasRef}
        style={{ width: "640px", height: "480px", border: "2px solid blue" }}
      />
      {/* The container is set to RTL with additional CSS to disable ligatures and preserve spacing */}
      <h2 
        dir="rtl" 
        style={{ 
          textAlign: "right", 
          whiteSpace: "pre-wrap", 
          fontFamily: "Arial, sans-serif", 
          fontVariantLigatures: "none" 
        }}
      >
        Sentence: {prediction}
      </h2>
      <div style={{border: "1px dashed red", padding: "0.5em", marginTop: "1em"}}>
  <strong>DEBUG INFO</strong>
  <pre>{JSON.stringify({ prediction, lastMergeable: lastMergeable.current }, null, 2)}</pre>
</div>

    </div>
  );
};

export default HandDetection;
