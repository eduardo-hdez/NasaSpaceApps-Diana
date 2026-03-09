# main.py
from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
from datetime import datetime
import csv
import json

from services.datasets import get_dataset_objects, select_clean_dataset
from services.analisis import analyze_observation, analyze_full_dataset

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define a data model (for POST requests)
class ExoplanetInput(BaseModel):
    brightness: float
    mass: float
    temperature: float

@app.get("/")
def root():
    return {"message": "Exoplanet API is running!"}

@app.post("/predict")
def predict(data: ExoplanetInput):
    # Placeholder: your ML model would go here
    if data.mass > 5 and data.brightness < 0.8:
        return {"is_exoplanet": True}
    return {"is_exoplanet": False}

@app.get("/datasets")
def fetch_datasets():
    return get_dataset_objects()

@app.get("/select-dataset/{datasetId}")
def select_dataset(datasetId: str):
    result = select_clean_dataset(datasetId)
    return result

class DatasetAnalysisRequest(BaseModel):
    observations: List[Dict]
    hyperparameters: Dict = None
    model: str = "tess"  # "tess" or "kepler"

@app.post("/analyze-dataset")
async def handle_dataset_analysis(request: DatasetAnalysisRequest):
    """
    Receives an array of observation objects from frontend
    Each observation contains all the astronomical parameters
    Also accepts optional hyperparameters for model configuration
    Returns the dataset with added 'classification' field for each row
    Plus model performance metrics and summary statistics
    """
    try:
        # Note: hyperparameters are accepted but not currently used
        # The pre-trained .pkl models don't support dynamic parameter changes
        # This is prepared for future model versions that support retraining
        observations = request.observations
        hyperparameters = request.hyperparameters
        model = request.model
        
        result = await analyze_full_dataset(observations, model)
        
        # Calculate classification counts
        classifications = [r.get('classification') for r in result]
        
        # Debug: Check what classifications look like
        print("Sample classifications:", classifications[:5] if len(classifications) > 0 else [])
        print("Classification types:", [type(c) for c in classifications[:5]] if len(classifications) > 0 else [])
        
        # Calculate model metrics
        confidences = [r.get('confidence', 0) for r in result]
        avg_confidence = sum(confidences) / len(confidences) if confidences else 0
        
        # Binary classification: 0 = non-candidate, 1 = candidate
        # Handle both string and int classifications from CSV
        summary = {
            "total": len(result),
            "candidates": sum(1 for c in classifications if str(c) == '1' or c == 1),
            "non_planets": sum(1 for c in classifications if str(c) == '0' or c == 0),
            "is_binary": True
        }
        print("SUMMARY: ", summary)
        
        return {
            "status": "success",
            "analyzed_data": result,
            "summary": summary,
            "model_metrics": {
                "average_confidence": avg_confidence,
                "low_confidence_count": sum(1 for c in confidences if c < 0.7),
                "high_confidence_count": sum(1 for c in confidences if c >= 0.9),
                "model_version": "1.0",
                "timestamp": datetime.now().isoformat()
            }
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

class ObservationAnalysisRequest(BaseModel):
    observation: Dict
    hyperparameters: Dict = None
    model: str = "tess"  # "tess" or "kepler"

@app.post("/analyze-observation")
async def handle_observation_analysis(request: ObservationAnalysisRequest):
    """
    Receives a single observation object from frontend
    Also accepts optional hyperparameters for model configuration
    Returns detailed classification with explanation
    """
    try:
        # Note: hyperparameters are accepted but not currently used
        # The pre-trained .pkl models don't support dynamic parameter changes
        observation = request.observation
        hyperparameters = request.hyperparameters
        model = request.model
        
        result = await analyze_observation(observation, model)
        return {
            "status": "success",
            "classification": result["classification"],
            "confidence": result["confidence"],
            "probabilities": result.get("probabilities", []),
            "feature_importance": result.get("feature_importance", []),
            "explanation": result.get("explanation", ""),
            "details": result.get("details", {})
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/upload-csv")
async def handle_dataset_upload(file: UploadFile = File(...)):
    contents = await file.read()
    
    # This endpoint can be used for validation if needed
    # For now, frontend handles CSV parsing
    
    return {"status": "success", "message": "CSV received"}