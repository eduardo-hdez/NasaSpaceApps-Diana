import React from "react";
import { useNavigate } from "react-router-dom";

const DatasetCard = ({ dataset }) => {
  const navigate = useNavigate();

  const handleTestNow = () => {
    navigate("/dashboard", {
      state: {
        selectedDataset: dataset,
        datasetType: dataset.type,
      },
    });
  };

  return (
    <div className="glass-card dataset-card">
      <div className="card-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d={dataset.icon} />
        </svg>
      </div>
      <div className="card-title">{dataset.name}</div>
      <div className="card-text">{dataset.description}</div>
      <div className="dataset-stats">
        <span className="stat-item">
          <strong>{dataset.records}</strong> records
        </span>
        <span className="stat-item">
          <strong>{dataset.size}</strong>
        </span>
      </div>
      <button className="btn btn-primary btn-test" onClick={handleTestNow}>
        Test Now
      </button>
    </div>
  );
};

export default DatasetCard;
