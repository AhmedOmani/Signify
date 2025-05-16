import json
import os
import matplotlib
matplotlib.use('TkAgg')
import matplotlib.pyplot as plt
import matplotlib.animation as animation
import numpy as np

# MediaPipe Holistic landmark indices for pose connections
POSE_CONNECTIONS = [
    (0, 1), (1, 2), (2, 3), (3, 7), (0, 4), (4, 5), (5, 6), (6, 8),
    (9, 10), (11, 12), (11, 13), (13, 15), (15, 17), (15, 19), (15, 21),
    (17, 19), (12, 14), (14, 16), (16, 18), (16, 20), (16, 22), (18, 20),
    (11, 23), (12, 24), (23, 24), (23, 25), (24, 26), (25, 27), (26, 28),
    (27, 29), (28, 30), (29, 31), (30, 32)
]

# MediaPipe Hands connections (same for left and right)
HAND_CONNECTIONS = [
    (0, 1), (1, 2), (2, 3), (3, 4),      # Thumb
    (0, 5), (5, 6), (6, 7), (7, 8),      # Index
    (5, 9), (9, 10), (10, 11), (11, 12), # Middle
    (9, 13), (13, 14), (14, 15), (15, 16), # Ring
    (13, 17), (17, 18), (18, 19), (19, 20), # Pinky
    (0, 17) # Palm base to pinky base
]

def get_all_landmarks(frames):
    """Collect all (x, y) from pose, hands, and face for global normalization."""
    all_points = []
    for frame in frames:
        for key in ['pose', 'left_hand', 'right_hand', 'face']:
            lm = frame.get(key)
            if lm:
                all_points.extend([pt[:2] for pt in lm])
    return np.array(all_points) if all_points else np.zeros((1,2))

def normalize_landmarks(landmarks, min_x, min_y, range_x, range_y):
    if not landmarks:
        return None
    norm = [
        [ (pt[0] - min_x) / range_x, (pt[1] - min_y) / range_y ] + pt[2:] for pt in landmarks
    ]
    return norm

def draw_landmarks(ax, landmarks, connections, color='red', lw=2, alpha=1.0, joint_size=30):
    if landmarks is None:
        return
    for start, end in connections:
        if start < len(landmarks) and end < len(landmarks):
            x = [landmarks[start][0], landmarks[end][0]]
            y = [landmarks[start][1], landmarks[end][1]]
            ax.plot(x, y, color=color, lw=lw, alpha=alpha)
    # Draw joints as larger circles
    xs = [pt[0] for pt in landmarks]
    ys = [pt[1] for pt in landmarks]
    ax.scatter(xs, ys, color=color, s=joint_size, alpha=alpha, zorder=3)

def draw_fake_head(ax, pose_landmarks, color='brown', radius=0.08):
    if pose_landmarks is None or len(pose_landmarks) == 0:
        return
    nose = pose_landmarks[0]
    head = plt.Circle((nose[0], nose[1]), radius, color=color, fill=False, lw=3, zorder=4)
    ax.add_patch(head)
    # Eyes
    eye_y = nose[1] - radius * 0.3
    ax.scatter([nose[0] - radius * 0.3, nose[0] + radius * 0.3], [eye_y, eye_y], color=color, s=20, zorder=5)
    # Mouth
    mouth_x = np.linspace(nose[0] - radius * 0.2, nose[0] + radius * 0.2, 20)
    mouth_y = nose[1] + radius * 0.3 + 0.01 * np.sin(np.linspace(0, np.pi, 20))
    ax.plot(mouth_x, mouth_y, color=color, lw=2, zorder=5)

def main():
    json_path = "/home/hp/Desktop/final-project-version/skeleton-signs/data/landmarks/شكرا_20250516_171201.json"
    if not os.path.exists(json_path):
        print('File not found!')
        return
    with open(json_path, 'r') as f:
        frames = json.load(f)

    # Compute global min/max for normalization
    all_points = get_all_landmarks(frames)
    min_x, min_y = np.min(all_points, axis=0)
    max_x, max_y = np.max(all_points, axis=0)
    range_x = max_x - min_x if max_x > min_x else 1
    range_y = max_y - min_y if max_y > min_y else 1

    fig, ax = plt.subplots(figsize=(6, 6))
    plt.axis('off')

    def update(frame_idx):
        ax.clear()
        ax.set_xlim(0, 1)
        ax.set_ylim(1, 0)  # Invert y for image-like display
        ax.axis('off')
        frame = frames[frame_idx]
        # Only draw if pose is present (skip empty frames)
        pose = normalize_landmarks(frame.get('pose'), min_x, min_y, range_x, range_y)
        if pose:
            draw_landmarks(ax, pose, POSE_CONNECTIONS, color='red', lw=2, joint_size=40)
            draw_fake_head(ax, pose, color='brown', radius=0.08)
        # Draw left hand
        left_hand = normalize_landmarks(frame.get('left_hand'), min_x, min_y, range_x, range_y)
        if left_hand:
            draw_landmarks(ax, left_hand, HAND_CONNECTIONS, color='blue', lw=2, joint_size=30)
        # Draw right hand
        right_hand = normalize_landmarks(frame.get('right_hand'), min_x, min_y, range_x, range_y)
        if right_hand:
            draw_landmarks(ax, right_hand, HAND_CONNECTIONS, color='green', lw=2, joint_size=30)
        ax.set_title(f'Frame {frame_idx+1}/{len(frames)}')

    ani = animation.FuncAnimation(fig, update, frames=len(frames), interval=50, repeat=True)
    plt.show()
    ani.save('skeleton_animation.mp4', writer='ffmpeg', fps=20)
    ani.save('skeleton_animation.gif', writer='pillow', fps=20)

if __name__ == '__main__':
    main() 