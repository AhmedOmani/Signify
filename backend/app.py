from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib
from collections import Counter

# Initialize Flask app
app = Flask(__name__)
# Allow connections from any device on the network
CORS(app, resources={r"/*": {"origins": "*"}})

# Load the static trained model
model = joblib.load("model.pkl")

# Arabic sign language mapping
# Note: Adjust labels based on your model's classes.
labels_dict = {0: 'أ', 1: 'ب', 2: 'ت', 3: 'ث', 4: 'ج', 5: 'ح',
               6: 'خ', 7: 'د', 8: 'ذ', 9: 'ر', 10: 'ز', 11: 'س',
               12: 'ش', 13: 'ص', 14: 'ض', 15: 'ط', 16: 'ظ', 17: 'ع',
               18: 'غ', 19: 'ف', 20: 'ق', 21: 'ك', 22: 'ل', 23: 'م',
               24: 'ن', 25: 'ه', 26: 'و', 27: 'ي', 28: 'تواصل', 29: 'تواصل',
               30: 'سويا', 31: 'انا', 32: 'نحن', 33: 'مرحبا', 34: 'فريق', 35: 'لمساعدة',
               36:'الصم', 37: 'إشارة'}

def process_hand(landmarks):
    """
    Given an array of landmarks (shape: (21,2)), normalize them so that each hand is scaled to [0, 1].
    Returns a vector of length 42.
    """
    x_vals = landmarks[:, 0]
    y_vals = landmarks[:, 1]
    min_x, max_x = x_vals.min(), x_vals.max()
    min_y, max_y = y_vals.min(), y_vals.max()
    range_x = max_x - min_x if (max_x - min_x) != 0 else 1
    range_y = max_y - min_y if (max_y - min_y) != 0 else 1

    norm_landmarks = []
    for (x, y) in landmarks:
        norm_x = (x - min_x) / range_x
        norm_y = (y - min_y) / range_y
        norm_landmarks.extend([norm_x, norm_y])
    return np.array(norm_landmarks)  # Vector of length 42

@ app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json  # Receive JSON data from frontend
        raw_landmarks = np.array(data["landmarks"])  # Single frame as flattened array
        print("Received landmarks:", raw_landmarks)
        print("Original shape:", raw_landmarks.shape)
        
        # Check if landmarks were provided and have at least enough numbers for one hand (42 numbers)
        if raw_landmarks.size == 0 or raw_landmarks.shape[0] < 42:
            return jsonify({"error": "please show your hands"})
        
        # We expect the frontend to send a flattened array:
        #   Single hand: 42 numbers; two hands: 84 numbers.
        if raw_landmarks.ndim == 1:
            n_numbers = raw_landmarks.shape[0]
            if n_numbers == 42:
                # Single hand detected → reshape and pad with zeros for second hand
                hand1 = raw_landmarks.reshape(21, 2)
                hand2 = np.zeros((21, 2))
            elif n_numbers >= 84:
                # Two-hand scenario: first 42 for hand1, next 42 for hand2
                hand1 = raw_landmarks[:42].reshape(21, 2)
                hand2 = raw_landmarks[42:84].reshape(21, 2)
            else:
                return jsonify({"error": "please show your hands"})
        else:
            return jsonify({"error": "Landmarks data must be a flattened array."})
        
        # Process each hand separately
        norm_hand1 = process_hand(hand1)  # 42 numbers
        norm_hand2 = process_hand(hand2)  # 42 numbers
        
        # Concatenate to create a fixed-length vector (84 numbers)
        normalized_landmarks = np.concatenate([norm_hand1, norm_hand2])
        print("Normalized landmarks:", normalized_landmarks)
        print("Vector length:", len(normalized_landmarks))
        
        # Reshape for prediction: (1 x 84)
        normalized_landmarks = normalized_landmarks.reshape(1, -1)
        print("Reshaped to:", normalized_landmarks.shape)
        
        # Predict using the static model
        prediction = model.predict(normalized_landmarks)[0]
        print("Raw model output:", prediction)
        predicted_character = labels_dict[int(prediction)]
        print("Predicted character:", predicted_character)
        
        return jsonify({"prediction": predicted_character})
    
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)})


# ----------------------------
# New Endpoint: /predict_sequence
# ----------------------------
# This endpoint is for receiving a sequence of frames.
# It expects a JSON payload with "sequence": a list of flattened arrays (each of length 84).
# It runs each frame through the static model and aggregates their predictions.
@app.route("/predict_sequence", methods=["POST"])
def predict_sequence():
    try:
        # Expecting a JSON payload with key "sequence"
        # Example: { "sequence": [ [84 numbers], [84 numbers], ... ] }
        data = request.get_json()
        sequence = np.array(data["sequence"])
        print("Received sequence of shape:", sequence.shape)
        
        token_buffer = []
        # For each frame in the sequence, get a prediction via the static model.
        for frame_data in sequence:
            frame = np.array(frame_data)
            # Validate the feature vector length.
            if frame.shape[0] != 84:
                continue  # Skip invalid frame
            features = frame.reshape(1, -1)
            prediction = model.predict(features)[0]
            token = labels_dict.get(int(prediction), "")
            token_buffer.append(token)

        # Aggregate the predictions using a majority vote.
        if not token_buffer:
            return jsonify({"error": "No valid predictions in sequence."})
        counts = Counter(token_buffer)
        final_token = counts.most_common(1)[0][0]
        print("Aggregated token from sequence:", final_token)
        return jsonify({"prediction": final_token})
    
    except Exception as e:
        print("Sequence Prediction Error:", e)
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    # Run on all network interfaces (0.0.0.0) instead of just localhost
    app.run(host='0.0.0.0', port=5000, debug=True)
