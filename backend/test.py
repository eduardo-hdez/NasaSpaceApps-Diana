import os
import joblib

def test_model():
    print("Testing model...")
    model_path = os.path.join(os.getcwd(), "models", "modelo_tess_exoplanetas.pkl")

    model = joblib.load(model_path)

    print("✅ Model loaded successfully!")
    print("Type:", type(model))
    print("Has predict:", hasattr(model, 'predict'))
    print("Has predict_proba:", hasattr(model, 'predict_proba'))
