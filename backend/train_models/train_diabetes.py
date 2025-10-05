import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
import joblib

# Load dataset
data = pd.read_csv('../diabetes.csv')  # Ensure diabetes.csv is in root folder
X = data.drop('Outcome', axis=1)
y = data['Outcome']

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train_scaled, y_train)

# Save scaler and model
joblib.dump(model, '../ml/diabetes_model.joblib')
joblib.dump(scaler, '../ml/diabetes_scaler.joblib')

print("Diabetes model trained and saved!")
