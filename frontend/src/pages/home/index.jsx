import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  processDescriptions,
  featureCards,
  challengeCards,
  teamMembers,
  metrics,
  techPills,
} from "./statics";
import NavBar from "../../components/Navbar";
import "../../assets/home.css";

const svgIcon = (path) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={path} />
  </svg>
);

const App = () => {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const countersRef = useRef([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for smooth initial animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) {
      return;
    }
    const ctx = canvas.getContext("2d");
    const STAR_COUNT = 300;
    const PLANET_COUNT = 3;
    const stars = [];
    const planets = [];
    let width = 0;
    let height = 0;
    let time = 0;

    const resizeCanvas = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = hero.offsetHeight;
    };

    const initStars = () => {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i += 1) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2 + 0.5,
          originalRadius: Math.random() * 2 + 0.5,
          alpha: Math.random() * 0.8 + 0.2,
          twinkle: Math.random() * 0.03 + 0.01,
          drift: Math.random() * 0.08 + 0.02,
          pulse: Math.random() * 0.02 + 0.01,
        });
      }
    };

    const initPlanets = () => {
      planets.length = 0;
      for (let i = 0; i < PLANET_COUNT; i += 1) {
        planets.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 8 + 4,
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.02 + 0.01,
          alpha: Math.random() * 0.3 + 0.1,
          color: i === 0 ? "#3b82f6" : i === 1 ? "#10b981" : "#8b5cf6",
        });
      }
    };

    const drawStars = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw planets
      for (const planet of planets) {
        planet.angle += planet.speed;
        planet.x += Math.cos(planet.angle) * 0.5;
        planet.y += Math.sin(planet.angle) * 0.3;

        if (planet.x < -planet.radius) planet.x = width + planet.radius;
        if (planet.x > width + planet.radius) planet.x = -planet.radius;
        if (planet.y < -planet.radius) planet.y = height + planet.radius;
        if (planet.y > height + planet.radius) planet.y = -planet.radius;

        const gradient = ctx.createRadialGradient(
          planet.x,
          planet.y,
          0,
          planet.x,
          planet.y,
          planet.radius
        );
        gradient.addColorStop(
          0,
          `${planet.color}${Math.floor(planet.alpha * 255)
            .toString(16)
            .padStart(2, "0")}`
        );
        gradient.addColorStop(1, `${planet.color}00`);

        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Draw stars
      for (const star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);

        // Create twinkling effect
        const twinkleIntensity =
          Math.sin(time * star.twinkle * 100) * 0.5 + 0.5;
        star.radius =
          star.originalRadius + Math.sin(time * star.pulse * 50) * 0.5;

        const gradient = ctx.createRadialGradient(
          star.x,
          star.y,
          0,
          star.x,
          star.y,
          star.radius
        );
        gradient.addColorStop(
          0,
          `rgba(255, 255, 255, ${star.alpha * twinkleIntensity})`
        );
        gradient.addColorStop(
          0.5,
          `rgba(255, 255, 255, ${star.alpha * twinkleIntensity * 0.5})`
        );
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = gradient;
        ctx.fill();

        star.y += star.drift;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }
      }

      time += 0.016;
      animationRef.current = requestAnimationFrame(drawStars);
    };

    resizeCanvas();
    initStars();
    initPlanets();
    drawStars();

    const handleResize = () => {
      resizeCanvas();
      initStars();
      initPlanets();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const revealElements = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      revealElements.forEach((el) => el.classList.add("visible"));
      return undefined;
    }

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // Add staggered delay based on element position
            setTimeout(() => {
              entry.target.classList.add("visible");
            }, index * 100);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    revealElements.forEach((el) => revealObserver.observe(el));

    return () => revealObserver.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll(".parallax");

      parallaxElements.forEach((element) => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const counterElements = countersRef.current;
    if (!counterElements.length) {
      return undefined;
    }

    if (!("IntersectionObserver" in window)) {
      counterElements.forEach((el) => {
        const target = parseFloat(el.dataset.target || "0");
        const suffix = el.dataset.suffix || "";
        el.textContent = `${target}${suffix}`;
      });
      return undefined;
    }

    const runCounter = (el) => {
      const target = parseFloat(el.dataset.target || "0");
      const suffix = el.dataset.suffix || "";
      const duration = 1500;
      const startTime = performance.now();

      const updateCounter = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        const formatted =
          target % 1 !== 0 ? value.toFixed(1) : Math.round(value);
        el.textContent = `${formatted}${suffix}`;
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      };

      requestAnimationFrame(updateCounter);
    };

    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counterElements.forEach((el) => counterObserver.observe(el));

    return () => counterObserver.disconnect();
  }, []);

  const handleSmoothScroll = (event, selector) => {
    event.preventDefault();
    const target = document.querySelector(selector);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* <style>{globalStyles}</style> */}
      {/* Sticky navigation */}
      <NavBar />

      <header>
        <section className="hero" id="top" ref={heroRef}>
          <canvas id="starfield" ref={canvasRef} aria-hidden="true" />
          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner">
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
              </div>
              <div className="loading-text">Initializing AI Systems...</div>
            </div>
          )}
          <div className="hero-layout">
            <div
              className={`hero-content ${isLoading ? "loading" : ""}`}
              data-section
            >
              <div className="hero-title-container">
                <h1 className="hero-title">
                  <span className="title-line">DIANA</span>
                </h1>
                <div className="title-accent"></div>
              </div>
              <p className="hero-subtitle">
                <span className="subtitle-text">Hunting Exoplanets with</span>
                <span className="subtitle-highlight">AI Precision</span>
              </p>
              <div className="hero-actions">
                <Link
                  to="/explore"
                  className="btn btn-primary hero-btn-primary"
                >
                  <span className="btn-text">Explore Data</span>
                  <div className="btn-glow"></div>
                </Link>
                <Link
                  to="/walkthrough/get-started"
                  className="btn btn-secondary hero-btn-secondary"
                >
                  <span className="btn-text">Start Hunting</span>
                  <div className="btn-particles"></div>
                </Link>
              </div>
            </div>
            <div className="planetary-system">
              <div className="orbit orbit-1">
                <div className="planet planet-1"></div>
              </div>
              <div className="orbit orbit-2">
                <div className="planet planet-2"></div>
              </div>
              <div className="orbit orbit-3">
                <div className="planet planet-3"></div>
              </div>
              <div className="orbit orbit-4">
                <div className="planet planet-4">
                  <div className="planet-rings"></div>
                </div>
              </div>
              <div className="orbit orbit-5">
                <div className="planet planet-5"></div>
              </div>
              <div className="orbit orbit-6">
                <div className="planet planet-6">
                  <div className="planet-rings"></div>
                </div>
              </div>
              <div className="orbit orbit-7">
                <div className="planet planet-7"></div>
              </div>
              <div className="orbit orbit-8">
                <div className="planet planet-8"></div>
              </div>
              <div className="central-star"></div>
              <div className="space-dust"></div>
            </div>
          </div>
        </section>
      </header>

      <main>
        {/* What DIANA Does */}
        <section className="section" id="challenge" data-section>
          <div className="container reveal">
            <h2 className="section-title">What DIANA Does</h2>
            <div className="cards-grid three">
              {challengeCards.map((card, index) => (
                <div
                  key={card.title}
                  className="glass-card challenge-card"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="card-icon">{svgIcon(card.icon)}</div>
                  <div className="card-title">{card.title}</div>
                  <div className="card-text">{card.text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How DIANA Works */}
        <section className="section" id="approach" data-section>
          <div className="container reveal">
            <h2 className="section-title">How DIANA Works</h2>
            <div className="process-flow glass-card">
              {processDescriptions.map((step) => (
                <div key={step.title} className="process-step">
                  <div className="card-title">{step.title}</div>
                  <div className="card-text">{step.text}</div>
                </div>
              ))}
            </div>
            <div className="tech-stack">
              {techPills.map((pill) => (
                <span key={pill} className="tech-pill">
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Metrics with counters */}
        <section className="section" id="metrics" data-section>
          <div className="container reveal">
            <h2 className="section-title">DIANA's Performance</h2>
            <p className="section-subtext">
              Proven results from extensive testing on real space mission data
              and validated exoplanet datasets.
            </p>
            <div className="metrics-grid">
              {metrics.map((metric, index) => (
                <div key={metric.label} className="glass-card">
                  <div
                    className="metric-value"
                    data-counter
                    data-target={metric.target}
                    data-suffix={metric.suffix}
                    ref={(el) => {
                      if (el) {
                        countersRef.current[index] = el;
                      }
                    }}
                  >
                    0{metric.suffix}
                  </div>
                  <div className="metric-label">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="section" id="features" data-section>
          <div className="container reveal">
            <h2 className="section-title">DIANA's Capabilities</h2>
            <div className="cards-grid four">
              {featureCards.map((card) => (
                <div key={card.title} className="glass-card feature-card">
                  <div className="card-icon">{svgIcon(card.icon)}</div>
                  <div className="card-title">{card.title}</div>
                  <div className="card-text">{card.text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer call-to-action */}
      <footer className="footer-cta" data-section>
        <h2 className="section-title">Ready to Hunt New Worlds?</h2>
        <p className="section-subtext">
          Deploy DIANA AI with your mission data and accelerate the search for
          habitable exoplanets.
        </p>
        <Link className="btn btn-primary btn-glow" to="/dashboard">
          Start Hunting Exoplanets
        </Link>
        <div className="footer-links">
          <a href="https://github.com" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://docs.nasa.gov" target="_blank" rel="noreferrer">
            Documentation
          </a>
          <a href="mailto:contact@diana.ai">Contact</a>
        </div>
      </footer>
    </>
  );
};

export default App;
