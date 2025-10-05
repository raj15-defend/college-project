from fastapi import APIRouter
from pydantic import BaseModel
from app.ml_model import predict_diabetes

router = APIRouter()

class DiabetesInput(BaseModel):
    features: list[float]

@router.post("/predict")
def diabetes_predict(data: DiabetesInput):
    result = predict_diabetes(data.features)
    return {"prediction": result, "message": "Diabetes Detected" if result == 1 else "Healthy"}
