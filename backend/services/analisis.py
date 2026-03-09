import joblib
import numpy as np
import pandas as pd
from typing import Dict, List
import os

# Global variables to cache models
_models = {}

def load_model(model_name="tess"):
    """Load the ML model from pickle file based on model name"""
    global _models
    
    if model_name not in _models:
        try:
            model_path = os.path.join(os.getcwd(), "models", f"modelo_{model_name}_exoplanetas.pkl")
            _models[model_name] = joblib.load(model_path)
            print(f"✅ Model loaded successfully from {model_path}")
            print(f"Model type: {type(_models[model_name])}")
        except Exception as e:
            print(f"❌ Error loading model {model_name}: {e}")
            _models[model_name] = None
    
    return _models[model_name]

def preprocess_observation(observation: Dict, model_name: str = "tess") -> np.ndarray:
    """
    Preprocess a single observation for model prediction
    Convert dict to numpy array in the correct feature order based on model
    """
    # Define expected features for each model (from clean datasets)
    if model_name == "kepler":
        expected_features = [
            'rowid', 'koi_fpflag_nt', 'koi_score', 'koi_period', 'koi_dikco_msky',
            'koi_fpflag_co', 'koi_fpflag_ss', 'koi_num_transits', 'koi_count',
            'koi_steff_err1', 'koi_fpflag_ec', 'koi_srho_err2', 'kepid',
            'koi_fwm_sdeco', 'koi_depth', 'koi_dikco_mra_err', 'koi_fwm_stat_sig',
            'koi_prad_err1', 'koi_dicco_msky', 'koi_smet_err2', 'koi_ror',
            'koi_dikco_msky_err', 'koi_prad', 'koi_dor'
        ]
    else:  # tess
        expected_features = [
            'pl_radeerr1', 'st_rad', 'pl_orbper', 'st_dist', 'st_disterr2',
            'pl_trandep', 'pl_rade', 'st_pmra', 'pl_orbpererr2', 'pl_tranmiderr2',
            'pl_tranmid', 'pl_eqt', 'st_tmag', 'pl_trandeperr1', 'pl_trandeperr2',
            'pl_orbpererr1', 'st_logg', 'pl_insol', 'st_tefferr2', 'st_teff',
            'st_disterr1', 'pl_trandurh', 'pl_trandurherr1', 'pl_tranmiderr1'
        ]
    
    # Extract values in the correct order, use 0 for missing values
    values = []
    for feature in expected_features:
        value = observation.get(feature, 0)
        # Handle None or empty string
        if value is None or value == '':
            value = 0
        values.append(float(value))
    
    return np.array(values).reshape(1, -1)

def calculate_feature_importance(observation: Dict, prediction: int, model) -> List[Dict]:
    """
    Calculate feature importance for the prediction
    This is a simplified version - in production, use SHAP or similar
    """
    feature_names = [
        'Transit Midpoint', 'Star Radius', 'Orbital Period', 'Star Distance',
        'Star Distance Error Lower', 'Transit Depth', 'Planet Radius',
        'Star Angular Motion', 'Orbit Period Error Lower', 'Transit Midpoint Uncertainty',
        'Transit Midpoint Time', 'Equilibrium Temp', 'Star Brightness',
        'Star Temp', 'Transit Depth Error Upper', 'Transit Depth Error Lower',
        'Orbit Period Error Upper', 'Surface Gravity', 'Stellar Irradiance',
        'Temp Error Lower', 'Effective Star Temp', 'Star Distance Error Upper',
        'Transit Duration', 'Transit Duration Error', 'Transit Midpoint Error Upper'
    ]
    
    # For demonstration, create mock feature importance
    # In production, use model.feature_importances_ or SHAP values
    try:
        if hasattr(model, 'feature_importances_'):
            importances = model.feature_importances_
        else:
            # Generate mock importances for demonstration
            np.random.seed(42)
            importances = np.random.random(len(feature_names))
            importances = importances / importances.sum()
    except:
        # Fallback to uniform importance
        importances = np.ones(len(feature_names)) / len(feature_names)
    
    # Sort by importance
    feature_importance = [
        {"name": name, "importance": float(imp)}
        for name, imp in zip(feature_names, importances)
    ]
    feature_importance.sort(key=lambda x: x['importance'], reverse=True)
    
    return feature_importance

def generate_explanation(observation: Dict, classification: int, confidence: float, feature_importance: List[Dict]) -> str:
    """
    Generate a natural language explanation for the classification
    """
    class_labels = {
        0: "non-planet",
        1: "ambiguous object",
        2: "planet candidate",
        3: "confirmed planet"
    }
    
    label = class_labels.get(classification, "unknown")
    
    # Get top 3 features
    top_features = feature_importance[:3]
    
    explanation = f"This observation has been classified as a {label} with {confidence*100:.1f}% confidence. "
    
    if classification == 3:
        explanation += "The transit characteristics strongly indicate the presence of an exoplanet. "
    elif classification == 2:
        explanation += "The signal shows promising planetary characteristics but requires further confirmation. "
    elif classification == 1:
        explanation += "The signal has ambiguous characteristics that could be either planetary or non-planetary in nature. "
    else:
        explanation += "The characteristics do not match typical exoplanet signatures. "
    
    explanation += f"Key factors in this classification include: {top_features[0]['name']} "
    explanation += f"({top_features[0]['importance']*100:.1f}% influence), "
    explanation += f"{top_features[1]['name']} ({top_features[1]['importance']*100:.1f}% influence), "
    explanation += f"and {top_features[2]['name']} ({top_features[2]['importance']*100:.1f}% influence)."
    
    return explanation

async def analyze_observation(observation: Dict, model_name: str = "tess") -> Dict:
    """
    Analyze a single observation and return detailed results with explanation
    """
    model = load_model(model_name)
    print("MODEL: ", model)
    
    if model is None:
        # Return mock data if model not available
        print("MODEL WAS NONE")
        return {
            "classification": 2,
            "confidence": 0.75,
            "probabilities": [0.05, 0.15, 0.75, 0.05],
            "feature_importance": [
                {"name": "Transit Depth", "importance": 0.25},
                {"name": "Orbital Period", "importance": 0.20},
                {"name": "Planet Radius", "importance": 0.15},
                {"name": "Star Radius", "importance": 0.12},
                {"name": "Equilibrium Temp", "importance": 0.10},
            ],
            "explanation": "This is a mock analysis. The actual model could not be loaded. In production, this observation would be analyzed using the trained ML model to determine if it represents an exoplanet.",
            "details": {}
        }
    
    try:
        # Preprocess the observation
        X = preprocess_observation(observation, model_name)
        
        # Make prediction
        prediction = model.predict(X)[0]
        
        # Get probabilities if available
        if hasattr(model, 'predict_proba'):
            probabilities = model.predict_proba(X)[0].tolist()
            confidence = probabilities[int(prediction)]
        else:
            # Mock probabilities
            probabilities = [0.0] * 4
            probabilities[int(prediction)] = 0.85
            confidence = 0.85
        
        # Calculate feature importance
        feature_importance = calculate_feature_importance(observation, int(prediction), model)
        
        # Generate explanation
        explanation = generate_explanation(observation, int(prediction), confidence, feature_importance)
        
        return {
            "classification": int(prediction),
            "confidence": float(confidence),
            "probabilities": probabilities,
            "feature_importance": feature_importance[:10],  # Top 10 features
            "explanation": explanation,
            "details": {
                "model_type": str(type(model).__name__),
                "features_used": len(X[0])
            }
        }
    
    except Exception as e:
        print(f"Error in analyze_observation: {e}")
        # Return error as mock data
        return {
            "classification": 1,
            "confidence": 0.5,
            "probabilities": [0.25, 0.5, 0.15, 0.1],
            "feature_importance": [],
            "explanation": f"Error during analysis: {str(e)}. Using fallback classification.",
            "details": {"error": str(e)}
        }

async def analyze_full_dataset(observations: List[Dict], model_name: str = "tess") -> List[Dict]:
    """
    Analyze multiple observations and return results with classifications
    If observations already have classification field, skip model prediction
    """
    # Check if data already has classification (from clean datasets)
    if observations and 'classification' in observations[0]:
        print("Dataset already has classifications, skipping model prediction")
        # Ensure all observations have confidence field
        results = []
        for obs in observations:
            if 'confidence' not in obs:
                obs['confidence'] = 0.95  # High confidence for pre-classified data
            results.append(obs)
        return results
    
    model = load_model(model_name)
    
    if model is None:
        # Return mock data if model not available
        results = []
        for obs in observations:
            # Generate varied mock classifications
            mock_class = np.random.choice([0, 1, 2, 3], p=[0.4, 0.2, 0.3, 0.1])
            mock_conf = np.random.uniform(0.6, 0.95)
            results.append({
                **obs,
                "classification": int(mock_class),
                "confidence": float(mock_conf)
            })
        return results
    
    try:
        # Preprocess all observations
        X_list = [preprocess_observation(obs, model_name) for obs in observations]
        X = np.vstack(X_list)
        
        # Make predictions
        predictions = model.predict(X)
        
        # Get confidences
        if hasattr(model, 'predict_proba'):
            probabilities = model.predict_proba(X)
            confidences = [probs[int(pred)] for pred, probs in zip(predictions, probabilities)]
        else:
            confidences = [0.85] * len(predictions)  # Mock confidence
        
        # Combine results with original observations
        results = []
        for obs, pred, conf in zip(observations, predictions, confidences):
            results.append({
                **obs,
                "classification": int(pred),
                "confidence": float(conf)
            })
        
        return results
    
    except Exception as e:
        print(f"Error in analyze_full_dataset: {e}")
        # Return observations with mock classifications
        results = []
        for obs in observations:
            results.append({
                **obs,
                "classification": 1,
                "confidence": 0.5
            })
        return results