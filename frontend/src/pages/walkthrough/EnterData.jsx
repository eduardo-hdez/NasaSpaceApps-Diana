import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateFormValue, addObservationToDataset } from "../dashboard/store";
import "./styles/enterData.css";

const EnterData = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const activeModel = useSelector((state) => state.dashboardStore.activeModel);
  const tessFormFields = useSelector((state) => state.dashboardStore.tessFormFields);
  const keplerFormFields = useSelector((state) => state.dashboardStore.keplerFormFields);
  const tessFormValues = useSelector((state) => state.dashboardStore.tessFormValues);
  const keplerFormValues = useSelector((state) => state.dashboardStore.keplerFormValues);
  
  const formFields = activeModel === "kepler" ? keplerFormFields : tessFormFields;
  const formValues = activeModel === "kepler" ? keplerFormValues : tessFormValues;

  const handleInputChange = (key, value) => {
    dispatch(updateFormValue({ key, value: parseFloat(value) || 0 }));
  };

  const handleContinue = () => {
    // Add observation to dataset
    dispatch(addObservationToDataset(formValues));
    // Navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="enter-data-container">
      <div className="enter-data-content">
        <div className="enter-data-header">
          <h1>Enter Observation Data</h1>
          <p className="subtitle">Fill in the parameters for your observation</p>
          <div className="model-indicator">
            <span className="label">Active Model:</span>
            <span className="model-badge">{activeModel.toUpperCase()}</span>
          </div>
        </div>

        <div className="data-form-card compact">
          <div className="form-grid compact-grid">
            {formFields.map((field) => (
              <div key={field.key} className="form-field compact-field">
                <label htmlFor={field.key}>
                  {field.label}
                  {field.required && <span className="required">*</span>}
                </label>
                <input
                  type="number"
                  id={field.key}
                  value={formValues[field.key] || ""}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  step={field.step}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/walkthrough/get-started')}
            >
              ← Back
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleContinue}
            >
              Continue to Analysis →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterData;
