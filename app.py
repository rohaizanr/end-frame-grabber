import os
import cv2
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import tempfile

app = Flask(__name__)

# Allow all origins for the free version
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["POST", "GET", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

@app.route('/extract-frame', methods=['POST'])
def extract_frame():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided'}), 400
    
    video_file = request.files['video']
    if video_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Save temp video
    with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_video:
        video_file.save(temp_video.name)
        temp_video_path = temp_video.name

    try:
        # Open video
        cap = cv2.VideoCapture(temp_video_path)
        if not cap.isOpened():
            return jsonify({'error': 'Could not open video'}), 500
        
        # Get total frame count
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        if frame_count <= 0:
             return jsonify({'error': 'Video has no frames'}), 400

        # Set to last frame (frame_count - 1)
        cap.set(cv2.CAP_PROP_POS_FRAMES, max(0, frame_count - 1))
        
        ret, frame = cap.read()
        
        # If failed, try stepping back a bit
        if not ret and frame_count > 1:
            cap.set(cv2.CAP_PROP_POS_FRAMES, max(0, frame_count - 2))
            ret, frame = cap.read()

        if not ret:
             return jsonify({'error': 'Could not read last frame'}), 500

        # Save frame to temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_img:
            cv2.imwrite(temp_img.name, frame)
            temp_img_path = temp_img.name
            
        cap.release()
        
        # Return the image
        return send_file(temp_img_path, mimetype='image/jpeg')

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        # Cleanup temp video
        if os.path.exists(temp_video_path):
            os.remove(temp_video_path)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5001, host='0.0.0.0')
