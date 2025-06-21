import CameraComponent from "./HandDetection";
import TranslationResult from "./TranslationResult";
import "./App.css";
import logo from "./Signify.png";
import { useState } from "react";

function App() {
  const [prediction, setPrediction] = useState("");
  const [newWord, setNewWord] = useState("");
  const [error, setError] = useState("");
  const [lastMergeable, setLastMergeable] = useState(true);

  const handlePrediction = (newToken, wasMergeable) => {
    setError("");
    setNewWord(newToken);
    setPrediction((prev) => {
      let newPrediction;
      let newFlag;
      if (newToken.length === 1) {
        if (prev === "") {
          newPrediction = newToken;
          newFlag = true;
        } else if (wasMergeable) {
          newPrediction = prev + newToken;
          newFlag = true;
        } else {
          newPrediction = prev + " " + newToken;
          newFlag = true;
        }
      } else {
        newPrediction = prev ? prev + " " + newToken : newToken;
        newFlag = false;
      }
      setLastMergeable(newFlag);
      return newPrediction;
    });
  };

  const handleError = (msg) => {
    setError(msg);
  };

  const handleReset = () => {
    setPrediction("");
    setNewWord("");
    setError("");
    setLastMergeable(true);
  };

  return (
    <div className="app-root" dir="rtl">
      <header className="app-header">
        <img src={logo} alt="شعار سينيـفاي" className="app-logo" />
      </header>
      <main className="app-main" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
        <section className="translator-card">
          <CameraComponent onPrediction={handlePrediction} onError={handleError} />
          {error && <div className="error-message">{error}</div>}
        </section>
        <TranslationResult
          prediction={prediction}
          newWord={newWord}
          onReset={handleReset}
        />
      </main>
      <footer className="app-footer">
        <span>سينيـفاي &mdash; نجسر الفجوة، إشارة تلو الأخرى</span>
      </footer>
    </div>
  );
}

export default App;
