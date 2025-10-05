from fastapi import APIRouter
from pydantic import BaseModel
from app.ml_model import predict_parkinson

router = APIRouter()

class ParkinsonInput(BaseModel):
    features: list[float]

@router.post("/predict")
def parkinson_predict(data: ParkinsonInput):
    result = predict_parkinson(data.features)
    return {"prediction": result, "message": "Parkinson’s Detected" if result == 1 else "Healthy"}
