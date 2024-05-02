from fastapi import FastAPI, File, Depends, Request, UploadFile, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import JSONResponse
from tensorflow import keras
from tensorflow.keras.preprocessing import image as image_utils
import numpy as np
from pydantic import BaseModel
from PIL import Image
from io import BytesIO
import base64

app = FastAPI()

# Mount a static directory for serving CSS and other assets
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize Jinja2Templates
templates = Jinja2Templates(directory="templates")

def get_model():
    return keras.models.load_model('asl_model')

class PredictionResult(BaseModel):
    predicted_letter: str


async def load_and_scale_image(file: UploadFile) -> Image.Image:
    contents = await file.read()
    image = Image.open(BytesIO(contents))
    image = image.convert("L")  # Convert to grayscale
    image = image.resize((28, 28))
    image_array = np.array(image)
    image_array = image_array.reshape((1, 28, 28, 1)) / 255.0
    return Image.fromarray((image_array.squeeze() * 255).astype(np.uint8))


def predict_letter(image):
    alphabet = "abcdefghiklmnopqrstuvwxy"
    image = image_utils.img_to_array(image)
    image = image.reshape(1, 28, 28, 1)
    image = image / 255
    model = get_model()
    prediction = model.predict(image)
    predicted_letter = alphabet[np.argmax(prediction)]
    return predicted_letter


@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/", response_class=HTMLResponse)
async def root_post(request: Request, file: UploadFile = File(...), model: keras.models.Model = Depends(get_model)):
    try:
        # Load and scale the original image
        image = await load_and_scale_image(file)

        # Predict the letter on the original image
        predicted_letter = predict_letter(image)

        # Convert image to base64
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()

        return templates.TemplateResponse("index.html", {
            "request": request,
            "original_image": img_str,
            "predicted_letter": predicted_letter
        })
    except HTTPException as e:
        return JSONResponse(content={"error": str(e)}, status_code=e.status_code)
    except Exception as e:
        return JSONResponse(content={"error": f"Error processing image: {str(e)}"}, status_code=500)
