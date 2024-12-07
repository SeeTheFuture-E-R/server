import uvicorn
from fastapi import FastAPI, HTTPException, File, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
import pandas as pd
import asyncio
from PIL import Image
import cv2
import numpy as np
import os 
import json

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
    try:
        # Use a simple path for the trainer directory
        trainer_dir = "trainer"
        if not os.path.exists(trainer_dir):
            os.makedirs(trainer_dir)
        
        # Simple paths for model and mappings
        model_path = os.path.join(trainer_dir, "model.yml")
        mappings_path = os.path.join(trainer_dir, "mappings.json")

        # For the input images path
        base_path = os.path.abspath(os.path.dirname(__file__))
        images_path = os.path.join(base_path, '..', 'public', 'images', 'friends')
        images_path = os.path.normpath(images_path)
        
        if not os.path.exists(images_path):
            raise HTTPException(status_code=400, detail=f"Images directory not found: {images_path}")
            
        recognizer = cv2.face.LBPHFaceRecognizer_create()
        detector = cv2.CascadeClassifier("haarcascade_frontalface_default.xml")

        def getImagesAndLabels(path):
            imagePaths = [os.path.join(path, f) for f in os.listdir(path) if f.endswith(('.jpg', '.jpeg', '.png'))]
            print(f"\n[INFO] Found {len(imagePaths)} images")
            
            faceSamples = []
            ids = []
            name_mappings = {}

            FACE_SIZE = (100, 100)
            for imagePath in imagePaths:
                try:
                    PIL_img = Image.open(imagePath).convert('L')
                    img_numpy = np.array(PIL_img, 'uint8')

                    filename = os.path.splitext(os.path.basename(imagePath))[0]
                    parts = filename.split("-")
                    
                    if len(parts) != 2:
                        print(f"Skipping {filename}: Invalid format. Expected format: ID-name")
                        continue

                    try:
                        id = int(parts[0])
                        name = parts[1]
                    except ValueError:
                        print(f"Skipping {filename}: ID must be a number")
                        continue

                    name_mappings[str(id)] = name
                    print(f"Found ID: {id}, Name: {name}")

                    faces = detector.detectMultiScale(
                        img_numpy,
                        scaleFactor=1.1,
                        minNeighbors=5,
                        minSize=(30, 30)
                    )

                    if len(faces) == 0:
                        print(f"No face detected in {filename}")
                        continue

                    for (x, y, w, h) in faces:
                        face_img = img_numpy[y:y+h, x:x+w]
                        face_resized = cv2.resize(face_img, FACE_SIZE)
                        faceSamples.append(face_resized)
                        ids.append(id)
                        print(f"Added face for {name} (ID: {id})")

                except Exception as e:
                    print(f"Error processing {imagePath}: {str(e)}")
                    continue

            if not faceSamples:
                raise ValueError("No faces detected in any images")

            return np.array(faceSamples), np.array(ids, dtype=np.int32), {"names": name_mappings}

        print("\n[INFO] Starting training process...")
        faces, ids, mapping_data = getImagesAndLabels(images_path)

        if len(faces) == 0:
            raise HTTPException(status_code=400, detail="No faces detected in any images")

        print(f"\n[INFO] Training with {len(faces)} faces and {len(set(ids))} unique IDs")
        recognizer.train(faces, ids)

        print(f"Saving model to: {model_path}")
        recognizer.write(model_path)
        
        with open(mappings_path, 'w', encoding='utf-8') as f:
            json.dump(mapping_data, f, ensure_ascii=False, indent=2)

        return {
            "message": "Training completed successfully",
            "faces_trained": len(faces),
            "unique_ids": len(set(ids)),
            "mappings": mapping_data
        }

    except Exception as e:
        print(f"Training error: {str(e)}")
        print(f"Current working directory: {os.getcwd()}")
        raise HTTPException(status_code=500, detail=str(e))



@app.post("/predict")
async def predict_face(file: UploadFile = File(...)):
    try:
        # Use simple paths matching training
        model_path = "trainer/model.yml"
        mappings_path = "trainer/mappings.json"

        if not os.path.exists(model_path) or not os.path.exists(mappings_path):
            raise FileNotFoundError("Model or mappings file not found")

        # Load mappings
        with open(mappings_path, 'r', encoding='utf-8') as f:
            mapping_data = json.load(f)
            name_mappings = mapping_data.get("names", {})

        # Load model
        recognizer = cv2.face.LBPHFaceRecognizer_create()
        recognizer.read(model_path)

        # Process uploaded image
        contents = await file.read()
        np_img = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

        # Convert the image to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Detect faces using same parameters as training
        faces = faceCascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(30, 30)
        )

        print(f"\n[INFO] faces {faces}")
        
        if len(faces) == 0:
            return {"message": "No faces detected"}

        results = []
        FACE_SIZE = (100, 100)  # Same size as training
        for (x, y, w, h) in faces:
            face_roi = gray[y:y+h, x:x+w]
            face_roi = cv2.resize(face_roi, FACE_SIZE)
            
            id, confidence = recognizer.predict(face_roi)
            print(f"\n[INFO] id {id} confidence {confidence}")
            name = name_mappings.get(str(id), "unknown")
            confidence_percentage = 100 - min(round(confidence), 100)
            
            results.append({
                "id": int(id),
                "name": name,
                "confidence": f"{confidence_percentage}%",
                "box": {
                    "x": int(x),
                    "y": int(y),
                    "width": int(w),
                    "height": int(h)
                }
            })

        return {
            "message": "Prediction successful",
            "results": results,
            "total_faces": len(results)
        }

    except FileNotFoundError as e:
        print(f"File not found error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Model or mappings file not found. Please ensure training has been completed."
        )
    except Exception as e:
        print(f"Error during prediction: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error during prediction: {str(e)}"
        )

async def ff():
    config = uvicorn.Config(app)
    server = uvicorn.Server(config)
    await server.serve()

asyncio.run(ff())
