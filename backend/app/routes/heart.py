from fastapi import APIRouter
from pydantic import BaseModel
from app.ml_model import predict_heart

router = APIRouter()

class HeartInput(BaseModel):
    features: list[float]

@router.post("/predict")
def heart_predict(data: HeartInput):
    result = predict_heart(data.features)
    return {"prediction": result, "message": "Heart Disease Detected" if result == 1 else "Healthy"}
