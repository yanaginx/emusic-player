# Importing the libraries
import cv2
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import *
import numpy as np
import time
import collections
import json
import os

# Change the working directory to the directory of the script
abspath = os.path.abspath(__file__)
dname = os.path.dirname(abspath)
os.chdir(dname)
# logs = []
# Load model
model = load_model('models/facial_emotion_recognition_new_dataset.h5')
# logs.append('Model loaded')

# Loading the cascades
face_cascade = cv2.CascadeClassifier(
    'models/haarcascade_frontalface_default.xml')
# logs.append('Cascade loaded')

modelFile = 'models/res10_300x300_ssd_iter_140000.caffemodel'
configFile = 'config/deploy.prototxt.txt'
net = cv2.dnn.readNetFromCaffe(configFile, modelFile)
# logs.append('Caffe and config loaded')
conf_threshold = 0.5

capture_duration = 8
frame_rate = 15
start_record_time = time.time()
prev_time = time.time()
labels = []

class_labels = ['Angry', 'Happy', 'Neutral', 'Sad', 'Surprise']

# Using webcam to have image for detecting face
# VideoCapture(i),
# i = 0: Using embedded laptop/PC webcam
# i = 1: Using external webcam
capture = cv2.VideoCapture(0)

while (int(time.time() - start_record_time) < capture_duration):
    time_elapsed = time.time() - prev_time
    _, frame = capture.read()
    if time_elapsed > 1./frame_rate:
        prev_time = time.time()

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        faces = face_cascade.detectMultiScale(gray, 1.3, 5)

        (height, width) = frame.shape[:2]
        blob = cv2.dnn.blobFromImage(cv2.resize(
            frame, (300, 300)), 1.0, (300, 300), (104., 177., 123.))
        net.setInput(blob)
        detections = net.forward()

        for i in range(0, detections.shape[2]):

            confidence = detections[0, 0, i, 2]

            if confidence > conf_threshold:
                box = detections[0, 0, i, 3:7] * \
                    np.array([width, height, width, height])
                (x, y, w, h) = box.astype('int')
                cv2.rectangle(frame, (x, y), (w, h), (255, 255, 0), 2)
                gray_roi = gray[y:y+h, x:x+w]

                if gray_roi.shape[0] == 0 or gray_roi.shape[1] == 0:
                    continue
                else:
                    gray_roi = cv2.resize(gray_roi, (48, 48),
                                          interpolation=cv2.INTER_AREA)

                if np.sum([gray_roi]) != 0:
                    roi = gray_roi.astype('float') / 255.0
                    roi = img_to_array(roi)
                    roi = np.expand_dims(roi, axis=0)

                    # make a prediction on the ROI, then lookup the class

                    predict = model.predict(roi)[0]
                    label = class_labels[predict.argmax()]
                    labels.append(label)
                    label_position = (x, y - 20)
                    cv2.putText(frame, label, label_position,
                                cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 255, 0), 2)

        # cv2.imshow('Emotion :3', frame)

    # if cv2.waitKey(1) & 0xFF == ord('q'):
    #     break

capture.release()
fer_result = []
for label in class_labels:
    emotion = {
        "id": label,
        "counts": labels.count(label)
    }
    fer_result.append(emotion)
# label_counts = collections.Counter(labels)
# result = dict(label_counts)
# result.update({'Logs': logs})
# label_json = json.dumps(result)
label_json = json.dumps(fer_result)
# cv2.destroyAllWindows()
print(label_json)
