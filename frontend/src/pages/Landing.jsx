import { useEffect, useState } from "react";
import "../styles/Landing.css";
import { translations } from "../translations";

export default function LandingPage({ lang = "en" }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const t = translations[lang] || translations["en"];

  return (
    <div className="landing-container">
      <header className="landing-header">
        <img
          src="/logo-nombre.png"
          alt={`${t.landingTitle} Logo`}
          className="landing-logo"
        />
        <section className="landing-clock">
          <div className="clock-display">
            <span>{time.toLocaleTimeString()}</span>
          </div>
        </section>
      </header>

      <section className="landing-info">
        <h1>{t.landingTitle}</h1>
        <p>{t.landingDescription}</p>
      </section>
    </div>
  );
}
