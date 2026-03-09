import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setDataset, setSelectedDataset, setActiveModel } from "../dashboard/store";
import "./styles/selectDataset.css";

const SelectDataset = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const datasets = useSelector((state) => state.dashboardStore.availableDatasets);

  const handleDatasetSelect = async (datasetId) => {
    setIsLoading(true);
    
    // Auto-switch model based on dataset
    if (datasetId === "kepler" || datasetId === "k2") {
      dispatch(setActiveModel("kepler"));
    } else if (datasetId === "tess") {
      dispatch(setActiveModel("tess"));
    }
    
    dispatch(setSelectedDataset(datasetId));

    try {
      const response = await fetch(
        `http://localhost:8000/select-dataset/${datasetId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        const loadedData = result.data;
        dispatch(setDataset(loadedData));
        
        // Navigate to dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Error loading dataset:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const datasetInfo = {
    kepler: {
      icon: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
      description: "NASA's Kepler mission discovered thousands of exoplanets using the transit method",
      stats: ["9,565 observations", "Binary classification", "2009-2018 mission"]
    },
    k2: {
      icon: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      ),
      description: "Extended Kepler mission with modified observing strategy across multiple fields",
      stats: ["Extended mission", "Binary classification", "2014-2018 mission"]
    },
    tess: {
      icon: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ),
      description: "Transiting Exoplanet Survey Satellite conducting all-sky survey for exoplanets",
      stats: ["7,242 observations", "Binary classification", "2018-present"]
    }
  };

  return (
    <div className="select-dataset-container">
      <div className="select-dataset-content">
        <div className="select-dataset-header">
          <h1>Select a Dataset</h1>
          <p>Choose from pre-loaded mission datasets for analysis</p>
        </div>

        <div className="dataset-cards">
          {datasets.map((dataset) => (
            <div 
              key={dataset.id}
              className="dataset-card"
              onClick={() => handleDatasetSelect(dataset.id)}
            >
              <div className="dataset-icon">
                {datasetInfo[dataset.id]?.icon}
              </div>
              <h2>{dataset.name}</h2>
              <p className="dataset-description">
                {datasetInfo[dataset.id]?.description || dataset.description}
              </p>
              <div className="dataset-stats">
                {datasetInfo[dataset.id]?.stats.map((stat, index) => (
                  <span key={index} className="stat-badge">{stat}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button 
          className="back-btn"
          onClick={() => navigate('/walkthrough/get-started')}
          disabled={isLoading}
        >
          ← Back
        </button>

        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading dataset...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectDataset;
