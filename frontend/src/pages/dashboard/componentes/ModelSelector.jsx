import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setActiveModel } from "../store";

const ModelSelector = () => {
  const dispatch = useDispatch();
  const activeModel = useSelector((state) => state.dashboardStore.activeModel);

  const handleToggle = () => {
    const newModel = activeModel === "tess" ? "kepler" : "tess";
    dispatch(setActiveModel(newModel));
  };

  return (
    <div className="model-selector">
      <label className="model-label">Active Model:</label>
      <div className="toggle-container">
        <button
          className={`model-option ${activeModel === "kepler" ? "active" : ""}`}
          onClick={() => dispatch(setActiveModel("kepler"))}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ marginRight: "0.5rem" }}
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          Kepler
        </button>
        <button
          className={`model-option ${activeModel === "tess" ? "active" : ""}`}
          onClick={() => dispatch(setActiveModel("tess"))}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ marginRight: "0.5rem" }}
          >
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
          TESS
        </button>
      </div>

      <style jsx>{`
        .model-selector {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.2rem 1.5rem;
          background: rgba(26, 31, 58, 0.5);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-button);
          margin: 0;
          min-height: 60px;
        }

        .model-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          margin: 0;
        }

        .toggle-container {
          display: flex;
          gap: 0.5rem;
          flex: 1;
        }

        .model-option {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.6rem 1rem;
          border-radius: var(--radius-button);
          border: 1px solid var(--glass-border);
          background: rgba(26, 31, 58, 0.5);
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          height: 40px;
        }

        .model-option:hover {
          background: rgba(59, 130, 246, 0.1);
          border-color: var(--accent-blue);
          color: var(--text-primary);
        }

        .model-option.active {
          background: linear-gradient(
            135deg,
            rgba(16, 185, 129, 0.2),
            rgba(59, 130, 246, 0.2)
          );
          border-color: var(--accent-green);
          color: var(--text-primary);
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
        }

        .model-option.active svg {
          filter: drop-shadow(0 0 4px var(--accent-green));
        }

        @media (max-width: 768px) {
          .model-selector {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }

          .toggle-container {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ModelSelector;
