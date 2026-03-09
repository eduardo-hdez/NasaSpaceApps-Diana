import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setActiveModel, clearDataset } from "../dashboard/store";
import "./styles/chooseModel.css";

const ChooseModel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleModelSelect = (model) => {
    dispatch(setActiveModel(model));
    dispatch(clearDataset()); // Clear any existing dataset
    navigate('/dashboard');
  };

  return (
    <div className="choose-model-container">
      <div className="choose-model-content">
        <h1 className="choose-model-title">Select Analysis Model</h1>
        <p className="choose-model-subtitle">Choose which model you'd like to use for your analysis</p>
        
        <div className="model-cards">
          <div 
            className="model-card"
            onClick={() => handleModelSelect('kepler')}
          >
            <div className="model-icon">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <h2>Kepler</h2>
            <p className="model-description">
              NASA's Kepler mission model trained on thousands of confirmed exoplanets
            </p>
            <div className="model-stats">
              <span className="stat-badge">24 parameters</span>
              <span className="stat-badge">Binary classification</span>
            </div>
          </div>

          <div 
            className="model-card"
            onClick={() => handleModelSelect('tess')}
          >
            <div className="model-icon">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <h2>TESS</h2>
            <p className="model-description">
              Transiting Exoplanet Survey Satellite model for all-sky exoplanet detection
            </p>
            <div className="model-stats">
              <span className="stat-badge">24 parameters</span>
              <span className="stat-badge">Binary classification</span>
            </div>
          </div>
        </div>

        <button 
          className="back-btn"
          onClick={() => navigate('/walkthrough/get-started')}
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default ChooseModel;
