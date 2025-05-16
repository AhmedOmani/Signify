import cv2
import mediapipe as mp
import json
import os
from datetime import datetime

# Output directory for landmarks
OUTPUT_DIR = os.path.join('data', 'landmarks')
os.makedirs(OUTPUT_DIR, exist_ok=True)

mp_holistic = mp.solutions.holistic
mp_drawing = mp.solutions.drawing_utils

# Settings
MAX_FRAMES = 250  # Number of frames to record per sign

# Prompt user for sign label
sign_label = input('Enter the sign label (e.g., "hello"): ')

# Initialize webcam
cap = cv2.VideoCapture(0)

all_landmarks = []
frame_count = 0

with mp_holistic.Holistic(
    static_image_mode=False,
    model_complexity=1,
    smooth_landmarks=True,
    enable_segmentation=False,
    refine_face_landmarks=True,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.7
) as holistic:
    print("Press 'q' to quit early.")
    while cap.isOpened() and frame_count < MAX_FRAMES:
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame.")
            break
        # Flip for selfie view
        frame = cv2.flip(frame, 1)
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = holistic.process(rgb)

        # Draw all landmarks
        mp_drawing.draw_landmarks(frame, results.face_landmarks, mp_holistic.FACEMESH_TESSELATION,
                                  landmark_drawing_spec=None,
                                  connection_drawing_spec=mp_drawing.DrawingSpec(color=(80,110,10), thickness=1, circle_radius=1))
        mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_holistic.POSE_CONNECTIONS,
                                  landmark_drawing_spec=mp_drawing.DrawingSpec(color=(80,22,10), thickness=2, circle_radius=4),
                                  connection_drawing_spec=mp_drawing.DrawingSpec(color=(80,44,121), thickness=2, circle_radius=2))
        mp_drawing.draw_landmarks(frame, results.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS,
                                  landmark_drawing_spec=mp_drawing.DrawingSpec(color=(121,22,76), thickness=2, circle_radius=4),
                                  connection_drawing_spec=mp_drawing.DrawingSpec(color=(121,44,250), thickness=2, circle_radius=2))
        mp_drawing.draw_landmarks(frame, results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS,
                                  landmark_drawing_spec=mp_drawing.DrawingSpec(color=(245,117,66), thickness=2, circle_radius=4),
                                  connection_drawing_spec=mp_drawing.DrawingSpec(color=(245,66,230), thickness=2, circle_radius=2))

        # Save all landmarks for this frame
        frame_landmarks = {
            'face': [[lm.x, lm.y, lm.z] for lm in results.face_landmarks.landmark] if results.face_landmarks else None,
            'pose': [[lm.x, lm.y, lm.z, lm.visibility] for lm in results.pose_landmarks.landmark] if results.pose_landmarks else None,
            'left_hand': [[lm.x, lm.y, lm.z] for lm in results.left_hand_landmarks.landmark] if results.left_hand_landmarks else None,
            'right_hand': [[lm.x, lm.y, lm.z] for lm in results.right_hand_landmarks.landmark] if results.right_hand_landmarks else None
        }
        all_landmarks.append(frame_landmarks)

        cv2.putText(frame, f'Frame: {frame_count+1}/{MAX_FRAMES}', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255,0), 2)
        cv2.imshow('MediaPipe Holistic Capture', frame)
        frame_count += 1

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()

# Save landmarks to JSON
output_path = os.path.join(OUTPUT_DIR, f'{sign_label}_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json')
with open(output_path, 'w') as f:
    json.dump(all_landmarks, f)

print(f'Landmarks saved to {output_path}') 