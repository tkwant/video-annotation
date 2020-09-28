from flask import Flask,request, send_from_directory
from flask_cors import CORS
import cv2
UPLOAD_DIRECTORY = "frames"
import json
import glob
import os
app = Flask(__name__, static_url_path='/static')
cors = CORS(app)


@app.route('/videoToFrames', methods=['POST'])
def hello_world():
    input_json = request.get_json(force=True) 
    videoPath = input_json['videoPath']
    vidcap = cv2.VideoCapture(videoPath)
    fps = vidcap.get(cv2.CAP_PROP_FPS)
    success,image = vidcap.read()
    count = 0
    urls = []
    path = "static/frames/"
    files = glob.glob(path + "*")
    for f in files:
        os.remove(f)
    while success:
        print(success)
        imageName = "%d.png" % count
        cv2.imwrite(path + imageName, image)     # save frame as JPEG file      
        urls.append("http://localhost:5000/" + path + imageName)
        success,image = vidcap.read()
        count += 1
    return json.dumps({
        "fps": fps,
        "images": urls
        })

app.run(host="0.0.0.0", port=5000)

# @app.route('/test')