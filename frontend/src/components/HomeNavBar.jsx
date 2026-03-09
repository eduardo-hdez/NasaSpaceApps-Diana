import React from "react";
import { Link } from "react-router-dom";

function navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div>
          <Link to="/" className="brand">
            ExoDetect AI
          </Link>
        </div>
        <div className="nav-links">
          <a
            href="#features"
            onClick={(event) => handleSmoothScroll(event, "#features")}
          >
            Features
          </a>
          <a
            href="#demo"
            onClick={(event) => handleSmoothScroll(event, "#demo")}
          >
            Demo
          </a>
          <a
            href="#team"
            onClick={(event) => handleSmoothScroll(event, "#team")}
          >
            Team
          </a>
          <a className="primary-link" href="/app">
            Launch App
          </a>
        </div>
      </div>
    </nav>
  );
}

export default navbar;
