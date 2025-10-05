import joblib
import numpy as np

# Load models & scalers
heart_model = joblib.load("ml/heart_model.joblib")
heart_scaler = joblib.load("ml/heart_scaler.joblib")

diabetes_model = joblib.load("ml/diabetes_model.joblib")
diabetes_scaler = joblib.load("ml/diabetes_scaler.joblib")

parkinson_model = joblib.load("ml/parkinson_model.joblib")
parkinson_scaler = joblib.load("ml/parkinson_scaler.joblib")

# Prediction functions
def predict_heart(features: list):
    data = np.array(features).reshape(1, -1)
    data = heart_scaler.transform(data)
    return int(heart_model.predict(data)[0])

def predict_diabetes(features: list):
    data = np.array(features).reshape(1, -1)
    data = diabetes_scaler.transform(data)
    return int(diabetes_model.predict(data)[0])

def predict_parkinson(features: list):
    data = np.array(features).reshape(1, -1)
    data = parkinson_scaler.transform(data)
    return int(parkinson_model.predict(data)[0])
