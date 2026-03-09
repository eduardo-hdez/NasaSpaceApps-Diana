import React from "react";
import { Link } from "react-router-dom";

function navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div>
          <Link to="/" className="brand">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="diana-logo"
            >
              {/* Bow */}
              <path
                d="M4 12C4 8.68629 6.68629 6 10 6H14C17.3137 6 20 8.68629 20 12C20 15.3137 17.3137 18 14 18H10C6.68629 18 4 15.3137 4 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Arrow shaft */}
              <path
                d="M12 2L12 22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Arrow head */}
              <path
                d="M8 2L12 6L16 2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="currentColor"
              />
              {/* Bow string */}
              <path
                d="M10 6L10 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              <path
                d="M14 6L14 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            {/* Diana÷\ */}
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/explore">Explore</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link className="primary-link" to="/walkthrough/get-started">
            Start Hunting
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default navbar;
