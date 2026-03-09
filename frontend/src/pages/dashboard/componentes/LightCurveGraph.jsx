import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const LightCurveGraph = ({ data }) => {
  // Mock data for light curve showing transit
  const mockData = [];
  for (let i = 0; i < 100; i++) {
    const time = i / 10;
    let flux = 1.0;
    
    // Create a transit dip between time 4 and 6
    if (time >= 4 && time <= 6) {
      const transitCenter = 5;
      const depth = 0.02; // 2% dip
      const width = 1;
      const x = (time - transitCenter) / width;
      flux = 1.0 - depth * Math.exp(-x * x * 4);
    }
    
    // Add some noise
    flux += (Math.random() - 0.5) * 0.002;
    
    mockData.push({
      time: time.toFixed(2),
      flux: flux.toFixed(4),
    });
  }

  return (
    <div className="graph-container">
      <h3 className="graph-title">Light Curve Analysis</h3>
      <p className="graph-subtitle">Normalized flux over time showing transit event</p>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={mockData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis
            dataKey="time"
            label={{ value: "Time (hours)", position: "insideBottom", offset: -10 }}
            stroke="rgba(255, 255, 255, 0.6)"
            tick={{ fill: "rgba(255, 255, 255, 0.6)" }}
          />
          <YAxis
            domain={[0.975, 1.005]}
            label={{ value: "Normalized Flux", angle: -90, position: "insideLeft" }}
            stroke="rgba(255, 255, 255, 0.6)"
            tick={{ fill: "rgba(255, 255, 255, 0.6)" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(26, 31, 58, 0.95)",
              border: "1px solid rgba(16, 185, 129, 0.5)",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <ReferenceLine
            y={1.0}
            stroke="rgba(255, 255, 255, 0.3)"
            strokeDasharray="3 3"
            label={{ value: "Baseline", fill: "rgba(255, 255, 255, 0.5)" }}
          />
          <Line
            type="monotone"
            dataKey="flux"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="graph-stats">
        <div className="stat-item">
          <span className="stat-label">Transit Depth:</span>
          <span className="stat-value">2.0%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Duration:</span>
          <span className="stat-value">2.0 hrs</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">SNR:</span>
          <span className="stat-value">15.3</span>
        </div>
      </div>
    </div>
  );
};

export default LightCurveGraph;
