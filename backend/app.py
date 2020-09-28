from flask import Flask,request, send_from_directory
from flask_cors import CORS
import cv2
UPLOAD_DIRECTORY = "frames"
import json
import glob
import os
app = Flask(__name__, static_url_path='/static')
cors = CORS(app)
import os
URL_people = "http://localhost:5000/static/people/" 
# URL_bear = "http://localhost:5000/static/bear/" 



with open('lostDummySmall.json') as fp:
    lostDummy = json.load(fp)


    dummyLables= [{"id": 2, "label": "Aeroplane", "nameAndClass": "Aeroplane (VOC2012)", "description": "Includes gliders but not hang gliders or helicopters"}, {"id": 3, "label": "Bicycle", "nameAndClass": "Bicycle (VOC2012)", "description": "Includes tricycles, unicycles"}, {"id": 4, "label": "Bird", "nameAndClass": "Bird (VOC2012)", "description": "All birds"}, {"id": 5, "label": "Boat", "nameAndClass": "Boat (VOC2012)", "description": "Ships, rowing boats, pedaloes but not jet skis"}, {"id": 6, "label": "Bottle", "nameAndClass": "Bottle (VOC2012)", "description": "Plastic, glass or feeding bottles"}, {"id": 7, "label": "Bus", "nameAndClass": "Bus (VOC2012)", "description": "Includes minibus but not trams"}, {"id": 8, "label": "Car", "nameAndClass": "Car (VOC2012)", "description": "Includes cars, vans, large family cars for 6-8 people etc.\nExcludes go-carts, tractors, emergency vehicles, lorries/trucks etc.\nDo not label where only the vehicle interior is shown.\nInclude toys that look just like real cars, but not 'cartoony' toys."}, {"id": 9, "label": "Cat", "nameAndClass": "Cat (VOC2012)", "description": "Domestic cats (not lions etc.)"}, {"id": 10, "label": "Chair", "nameAndClass": "Chair (VOC2012)", "description": "Includes armchairs, deckchairs but not stools or benches.\nExcludes seats in buses, cars etc.\nExcludes wheelchairs."}, {"id": 11, "label": "Cow", "nameAndClass": "Cow (VOC2012)", "description": "All cows"}, {"id": 12, "label": "Dining table", "nameAndClass": "Dining table (VOC2012)", "description": "Only tables for eating at.\nNot coffee tables, desks, side tables or picnic benches"}, {"id": 13, "label": "Dog", "nameAndClass": "Dog (VOC2012)", "description": "Domestic dogs (not wolves etc.)"}, {"id": 14, "label": "Horse", "nameAndClass": "Horse (VOC2012)", "description": "Includes ponies, donkeys, mules etc."}, {"id": 15, "label": "Motorbike", "nameAndClass": "Motorbike (VOC2012)", "description": "Includes mopeds, scooters, sidecars"}, {"id": 16, "label": "Person", "nameAndClass": "Person (VOC2012)", "description": "Includes babies, faces (i.e. truncated people)"}, {"id": 17, "label": "Potted plant", "nameAndClass": "Potted plant (VOC2012)", "description": "Indoor plants excluding flowers in vases, or outdoor plants clearly in a pot. "}, {"id": 18, "label": "Sheep", "nameAndClass": "Sheep (VOC2012)", "description": "Sheep, not goats"}, {"id": 19, "label": "Sofa", "nameAndClass": "Sofa (VOC2012)", "description": "Excludes sofas made up as sofa-beds"}, {"id": 20, "label": "Train", "nameAndClass": "Train (VOC2012)", "description": "Includes train carriages, excludes trams"}, {"id": 21, "label": "TV/monitor", "nameAndClass": "TV/monitor (VOC2012)", "description": "Standalone screens (not laptops), not advertising displays"}]
    
    
    # bearDummy = []
    # for i in range(35):
    #     bearDummy.append({
    #                 "image": {
    #             "url": URL_bear + str(i)+ ".png"
    #         }
    #     })
    
    
    trackDummy= [
      {
        "trackId": 0,
        "labelId": 16,
        "label": "Person"
      },
      {
        "trackId": 1,
        "labelId": 16,
        "label": "Person"
      }
    ]
    
    
    @app.route('/getTracks', methods=['GET'])
    def test5():
        return  json.dumps(trackDummy)
    
    @app.route('/getLabels', methods=['GET'])
    def test4():
        return  json.dumps(dummyLables)
    
    @app.route('/getFps', methods=['GET'])
    def test3():
        return  "30"
    
    # @app.route('/getBear', methods=['GET'])
    # def test2():
    #     return json.dumps(bearDummy)
    
    
    @app.route('/getLost', methods=['GET'])
    def test():
        return json.dumps(lostDummy)
    
    
    @app.route('/videoToFrames', methods=['POST'])
    def hello_world():
        input_json = request.get_json(force=True) 
        videoPath = input_json['videoPath']
        vidcap = cv2.VideoCapture(videoPath)
        fps = vidcap.get(cv2.CAP_PROP_FPS)
        success,image = vidcap.read()
        count = 0
        urls = []
        path = "static/bear/"
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
    



