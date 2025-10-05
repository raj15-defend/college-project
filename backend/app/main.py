from fastapi import FastAPI
from app.routes import heart, diabetes, parkinson

app = FastAPI(title="Multi-Disease Prediction API")

# Include routers
app.include_router(heart.router, prefix="/api/heart")
app.include_router(diabetes.router, prefix="/api/diabetes")
app.include_router(parkinson.router, prefix="/api/parkinson")

@app.get("/")
def home():
    return {"message": "Multi-Disease Prediction Backend Running ✅"}
