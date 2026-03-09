import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PrecisionRecallGraph = ({ data }) => {
  // Mock data for precision-recall curve
  const mockData = [
    { recall: 0.0, precision: 1.0 },
    { recall: 0.1, precision: 0.98 },
    { recall: 0.2, precision: 0.95 },
    { recall: 0.3, precision: 0.93 },
    { recall: 0.4, precision: 0.90 },
    { recall: 0.5, precision: 0.87 },
    { recall: 0.6, precision: 0.83 },
    { recall: 0.7, precision: 0.78 },
    { recall: 0.8, precision: 0.72 },
    { recall: 0.9, precision: 0.65 },
    { recall: 1.0, precision: 0.55 },
  ];

  return (
    <div className="graph-container">
      <h3 className="graph-title">Precision-Recall Curve</h3>
      <p className="graph-subtitle">Model performance across different thresholds</p>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={mockData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis
            dataKey="recall"
            label={{ value: "Recall", position: "insideBottom", offset: -10 }}
            stroke="rgba(255, 255, 255, 0.6)"
            tick={{ fill: "rgba(255, 255, 255, 0.6)" }}
          />
          <YAxis
            label={{ value: "Precision", angle: -90, position: "insideLeft" }}
            stroke="rgba(255, 255, 255, 0.6)"
            tick={{ fill: "rgba(255, 255, 255, 0.6)" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(26, 31, 58, 0.95)",
              border: "1px solid rgba(59, 130, 246, 0.5)",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="precision"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: "#3b82f6", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="graph-stats">
        <div className="stat-item">
          <span className="stat-label">AUC-PR:</span>
          <span className="stat-value">0.85</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Optimal Threshold:</span>
          <span className="stat-value">0.62</span>
        </div>
      </div>
    </div>
  );
};

export default PrecisionRecallGraph;
