import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/getStarted.css";

const GetStarted = () => {
  const navigate = useNavigate();

  return (
    <div className="get-started-container">
      <div className="get-started-content">
        <h1 className="get-started-title">Exoplanet Analysis</h1>
        <p className="get-started-subtitle">Choose how you'd like to begin</p>
        
        <div className="choice-cards">
          <div 
            className="choice-card"
            onClick={() => navigate('/walkthrough/choose-model')}
          >
            <div className="card-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <h2>Enter Your Own Data</h2>
            <p>Choose a model and manually input observation parameters</p>
          </div>

          <div 
            className="choice-card"
            onClick={() => navigate('/walkthrough/select-dataset')}
          >
            <div className="card-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10,9 9,9 8,9" />
              </svg>
            </div>
            <h2>Select Preexisting Dataset</h2>
            <p>Choose from pre-loaded Kepler, K2, or TESS mission datasets</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
