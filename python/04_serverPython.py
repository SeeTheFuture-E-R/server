import uvicorn
from fastapi import FastAPI, HTTPException, File, UploadFile,Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.responses import JSONResponse
import pandas as pd
import asyncio
from PIL import Image
import cv2
import numpy as np
import os 

app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

faceCascade = cv2.CascadeClassifier("haarcascade_frontalface_default.xml")
recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.read('trainer/trainer.yml')

#try to get image from user
@app.post("/getPicture")
async def create_upload_file(file: UploadFile = File(...)):
    print("________________________________________")
    print(file)
    img = await file.read()
    file_path = os.path.join("./", file.filename)
    with open(file_path, "wb") as temp_file:
        temp_file.write(img)
    return {"filename": file.filename}

@app.post("/01")
def hello():
    cam = cv2.VideoCapture(0)
    cam.set(3, 640) # set video width
    cam.set(4, 480) # set video height

    face_detector = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

    # For each person, enter one numeric face id
    face_id = input('\n enter user id end press <return> ==>  ')
    # face_name = input('\n enter user name end press <return> ==>  ')

    print("\n [INFO] Initializing face capture. Look the camera and wait ...")
    # Initialize individual sampling face count
    count = 0

    while(True):

        ret, img = cam.read()
        img = cv2.flip(img, 1) # flip video image vertically
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_detector.detectMultiScale(gray, 1.3, 5)

        for (x,y,w,h) in faces:

            cv2.rectangle(img, (x,y), (x+w,y+h), (255,0,0), 2)     
            count += 1

            # Save the captured image into the datasets folder
            cv2.imwrite("dataset/" + str(face_id) + '-' + str(count) + ".jpg", gray[y:y+h,x:x+w])

            cv2.imshow('image', img)

        k = cv2.waitKey(100) & 0xff # Press 'ESC' for exiting video
        if k == 27:
            break
        elif count >= 30: # Take 30 face sample and stop video
             break

    # Do a bit of cleanup
    print("\n [INFO] Exiting Program and cleanup stuff")
    cam.release()
    cv2.destroyAllWindows()


@app.post("/02")
async def train_dataset():
    path = 'dataset'
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    detector = cv2.CascadeClassifier("haarcascade_frontalface_default.xml")

    def getImagesAndLabels(path):
        imagePaths = [os.path.join(path, f) for f in os.listdir(path)]
        faceSamples = []
        ids = []

        for imagePath in imagePaths:
            try:
                PIL_img = Image.open(imagePath).convert('L')  # Convert it to grayscale
                img_numpy = np.array(PIL_img, 'uint8')

                # Attempt to extract the ID
                filename = os.path.split(imagePath)[-1]
                parts = filename.split(".")[0].split("-")

                if parts[0].isdigit():
                    id = int(parts[0])
                elif parts[-1].isdigit():
                    id = int(parts[-1])
                else:
                    raise ValueError("No valid ID found in filename")

                faces = detector.detectMultiScale(img_numpy)

                for (x, y, w, h) in faces:
                    faceSamples.append(img_numpy[y:y+h, x:x+w])
                    ids.append(id)

            except Exception as e:
                print(f"Skipping file {imagePath}, error: {e}")

        return faceSamples, ids

    try:
        print("\n[INFO] Training faces. It will take a few seconds. Wait ...")
        faces, ids = getImagesAndLabels(path)

        if len(faces) == 0 or len(ids) == 0:
            raise HTTPException(status_code=400, detail="No faces or IDs found in the dataset")

        recognizer.train(faces, np.array(ids))
        recognizer.write('trainer/trainer.yml')  # recognizer.save() worked on Mac, but not on Pi

        print("\n[INFO] {0} faces trained. Exiting Program".format(len(np.unique(ids))))
        return {"message": f"{len(np.unique(ids))} faces trained successfully"}

    except Exception as e:
        print(f"Error during training: {e}")
        raise HTTPException(status_code=500, detail=f"Error during training: {e}")



# @app.post("/02")
# async def train_dataset():
#     path = 'dataset'
#     recognizer = cv2.face.LBPHFaceRecognizer_create()
#     detector = cv2.CascadeClassifier("haarcascade_frontalface_default.xml");

#     # function to get the images and label data
#     def getImagesAndLabels(path):

#         imagePaths = [os.path.join(path,f) for f in os.listdir(path)]     
#         faceSamples=[]
#         ids = []

#         for imagePath in imagePaths:

#             PIL_img = Image.open(imagePath).convert('L') # convert it to grayscale
#             img_numpy = np.array(PIL_img,'uint8')

#             id = int(os.path.split(imagePath)[-1].split(".")[0].split("-")[0])
#             name = os.path.split(imagePath)[-1].split(".")[0].split("-")[0]
#             faces = detector.detectMultiScale(img_numpy)

#             for (x,y,w,h) in faces:
#                 faceSamples.append(img_numpy[y:y+h,x:x+w])
#                 ids.append(id)

#         return faceSamples,ids

#     print ("\n [INFO] Training faces. It will take a few seconds. Wait ...")
#     faces,ids = getImagesAndLabels(path)
#     recognizer.train(faces, np.array(ids))

#     # Save the model into trainer/trainer.yml
#     recognizer.write('trainer/trainer.yml') # recognizer.save() worked on Mac, but not on Pi

#     # Print the numer of faces trained and end program
#     print("\n [INFO] {0} faces trained. Exiting Program".format(len(np.unique(ids))))

@app.post("/03")
async def face_recognition(file: UploadFile = File(...)):
    # print("________________________________________")
    # print(file)
    img = await file.read()
    file_path = os.path.join("./", file.filename)
    with open(file_path, "wb") as temp_file:
        temp_file.write(img)
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    with open('C:/Users/Me/Desktop/פרויקט גמר/server/python/trainer/trainer.yml') as file:
        out = file.read()
    cascadePath = "haarcascade_frontalface_default.xml"
    faceCascade = cv2.CascadeClassifier(cascadePath)
    print("####################################################################")
    if faceCascade.empty():
        print("Error loading cascade file. Check the path or the file contents.")
        return
    font = cv2.FONT_HERSHEY_SIMPLEX
    names = ['None', 'Renana', 'Ester', 'Leah', 'Billi', 'Ester', 'Mamy', 'Ayelet', 'Billi', 'Renana', 'Chana']

    # Load the image
    img_array = np.frombuffer(img, np.uint8)
    img_cv = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    img_cv = cv2.flip(img_cv, 1) # Flip vertically
    gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
    faces = faceCascade.detectMultiScale(
        gray,
        scaleFactor=1.2,
        minNeighbors=5,
        minSize=(30, 30),  # Example minimum size
    )
    

    results = []
    if len(faces) > 0:
        print(faces[0])
        print("faces detected")  # Print the first detected face coordinates

        for (x, y, w, h) in faces:
            cv2.rectangle(img_cv, (x, y), (x + w, y + h), (0, 255, 0), 2)
            try:
                id, confidence = recognizer.predict(gray[y:y + h, x:x + w])

                # Check if confidence is less than 100
                if confidence < 100 and id < len(names):
                    name = names[id]
                    confidence_text = f"{100 - round(confidence)}%"
                else:
                    name = "unknown"
                    confidence_text = f"{100 - round(confidence)}%"

                results.append({"id": name, "confidence": confidence_text})

                cv2.putText(img_cv, name, (x + 5, y - 5), font, 1, (255, 255, 255), 2)
                cv2.putText(img_cv, confidence_text, (x + 5, y + h - 5), font, 1, (255, 255, 0), 1)
            except cv2.error as e:
                print(f"Error during prediction: {e}")
                results.append({"id": "error", "confidence": "N/A"})
    else:
        print("No faces detected")

    # Clean up
    os.remove(file_path)
    print("\n [INFO] Exiting Program and cleanup stuff")

    return JSONResponse(content={"results": results})

    #iniciate id counter
    id = 0

    # names related to ids: example ==> Marcelo: id=1,  etc
    # names = ['None', 'Renana', 'Ester', 'Leah', 'Billi', 'Ester', 'Mamy', 'Ayelet', 'Billi', 'Renana', 'Chana']

    # # Initialize and start realtime video capture
    # cam = cv2.VideoCapture(0)
    # cam.set(3, 640) # set video widht
    # cam.set(4, 480) # set video height

    # # Define min window size to be recognized as a face
    # minW = 0.1*cam.get(3)
    # minH = 0.1*cam.get(4)


    # while True:
    #     ret, img =cam.read()
    #     img = cv2.flip(img, 1) # Flip vertically
    #     # img = cv2.imread('a.jpg')
    #     gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    #     faces = faceCascade.detectMultiScale( 
    #         gray,
    #         scaleFactor = 1.2,
    #         minNeighbors = 5,
    #         minSize = (int(minW), int(minH)),
    #         )

    #     for(x,y,w,h) in faces:

    #         cv2.rectangle(img, (x,y), (x+w,y+h), (0,255,0), 2)

    #         id, confidence = recognizer.predict(gray[y:y+h,x:x+w])

    #         # Check if confidence is less them 100 ==> "0" is perfect match 
    #         if (confidence < 100 and id < len(names)):
    #             print(id)
    #             id = names[id]
    #             confidence = "  {0}%".format(round(100 - confidence))
    #         else:
    #             id = "unknown"
    #             confidence = "  {0}%".format(round(100 - confidence))

    #         cv2.putText(img, str(id), (x+5,y-5), font, 1, (255,255,255), 2)
    #         cv2.putText(img, str(confidence), (x+5,y+h-5), font, 1, (255,255,0), 1)  

    #         cv2.imshow('camera',img) 

    #     # k = cv2.waitKey(10) & 0xff # Press 'ESC' for exiting video
    #     # if k == 27:
    #     #     break

    # # Do a bit of cleanup
    # print("\n [INFO] Exiting Program and cleanup stuff")
    # cam.release()
    # cv2.destroyAllWindows()


@app.post("/predict")
async def predict_face(file: UploadFile = File(...)):
    try:
        # Read the image file
        contents = await file.read()
        np_img = np.fromstring(contents, np.uint8)
        img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

        # Convert the image to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Detect faces
        faces = faceCascade.detectMultiScale(
            gray,
            scaleFactor=1.2,
            minNeighbors=5,
            minSize=(30, 30)
        )

        if len(faces) == 0:
            return {"message": "No faces detected"}

        for (x, y, w, h) in faces:
            roi_gray = gray[y:y+h, x:x+w]
            id, confidence = recognizer.predict(roi_gray)
            print(f"Predicted ID: {id}, Confidence: {confidence}")

        return {"message": "Prediction successful", "id": id, "confidence": confidence}

    except Exception as e:
        print(f"Error during prediction: {e}")
        raise HTTPException(status_code=500, detail=f"Error during prediction: {e}")    

@app.get("/")
def helloWorld():
    return "Hello, cross-origin-world!"

async def ff():
    config = uvicorn.Config(app)
    server = uvicorn.Server(config)
    await server.serve()

asyncio.run(ff())
hello()
