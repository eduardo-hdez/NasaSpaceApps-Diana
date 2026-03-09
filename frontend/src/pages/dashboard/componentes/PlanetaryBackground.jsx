import React from "react";
import "../styles/planetaryBackground.css";

const PlanetaryBackground = () => {
  return (
    <div className="planetary-background">
      <div className="saturn-container">
        {/* Saturn planet */}
        <div className="saturn">
          <div className="saturn-body"></div>
          <div className="saturn-rings"></div>
        </div>
        
        {/* Orbiting moons */}
        <div className="moon-orbit moon-orbit-1">
          <div className="moon moon-1"></div>
        </div>
        <div className="moon-orbit moon-orbit-2">
          <div className="moon moon-2"></div>
        </div>
      </div>
    </div>
  );
};

export default PlanetaryBackground;
