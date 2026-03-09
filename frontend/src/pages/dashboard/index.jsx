import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import NavBar from "../../components/Navbar";
import AstronomicalDataInput from "./componentes/AstronomicalDataInput";
import DatasetActionButtons from "./componentes/DatasetActionButtons";
import DatasetTable from "./componentes/DatasetTable";
import Results from "./componentes/Results";
import PlanetaryBackground from "./componentes/PlanetaryBackground";
import PrecisionRecallGraph from "./componentes/PrecisionRecallGraph";
import LightCurveGraph from "./componentes/LightCurveGraph";
import {
  setIsAnalyzing,
  setAnalyzedDataset,
  setAnalysisResult,
  setAnalysisType,
} from "./store";
import "./styles.css";
import "./styles/graphs.css";

const Dashboard = () => {
  const dispatch = useDispatch();
  const dataset = useSelector((state) => state.dashboardStore.dataset);
  const analysisType = useSelector((state) => state.dashboardStore.analysisType);
  const activeModel = useSelector((state) => state.dashboardStore.activeModel);
  const hyperparameters = useSelector((state) => state.dashboardStore.hyperparameters);

  // Auto-analyze on mount if there's data (from walkthrough dataset selection)
  useEffect(() => {
    const autoAnalyze = async () => {
      // Only auto-analyze if we have a full dataset (more than 1 observation)
      // This means user came from dataset selection, not manual entry
      if (dataset && dataset.length > 1) {
        dispatch(setIsAnalyzing(true));
        
        try {
          // Dataset analysis
          const response = await fetch("http://localhost:8000/analyze-dataset", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              observations: dataset,
              hyperparameters: hyperparameters,
              model: activeModel,
            }),
          });

          if (response.ok) {
            const result = await response.json();
            dispatch(setAnalyzedDataset(result.analyzed_data));
            dispatch(setAnalysisResult({
              summary: result.summary,
              model_metrics: result.model_metrics,
            }));
            dispatch(setAnalysisType("batch"));
          }
        } catch (err) {
          console.error("Auto-analysis failed:", err);
        } finally {
          dispatch(setIsAnalyzing(false));
        }
      }
    };

    autoAnalyze();
  }, []); // Only run once on mount

  return (
    <main style={{ position: 'relative', overflow: 'hidden' }}>
      <PlanetaryBackground />
      <NavBar />
      <div className="container" style={{ padding: '2rem 0' }}>
        {/* Input Form with Action Buttons */}
        <div className="input-section">
          <AstronomicalDataInput />
          <div className="action-buttons-container">
            <DatasetActionButtons />
          </div>
        </div>

        {/* New Layout: Dataset Table + Graph side by side */}
        <div className="analysis-grid">
          <div className="table-section">
            <DatasetTable />
          </div>
          <div className="graph-section">
            {analysisType === "batch" && <PrecisionRecallGraph />}
            {analysisType === "single" && <LightCurveGraph />}
            {!analysisType && (
              <div className="graph-placeholder">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  opacity="0.3"
                >
                  <line x1="12" y1="20" x2="12" y2="10" />
                  <line x1="18" y1="20" x2="18" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="16" />
                </svg>
                <p>Analysis graph will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Results Section Below */}
        <div className="results-section">
          <Results />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;