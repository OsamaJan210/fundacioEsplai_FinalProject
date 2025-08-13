import { useEffect, useState } from "react";
import "../styles/Landing.css";

export default function LandingPage() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="landing-container">
      {/* Header */}
      <header className="landing-header">
        <img src="/logo-nombre.png" alt="Business Essential Logo" className="landing-logo" />
         {/* Clock */}
      <section className="landing-clock">
        <div className="clock-display">
          <span>{time.toLocaleTimeString()}</span>
        </div>
      </section>
      </header>

      {/* Description */}
      <section className="landing-info">
        <p>
          <strong>Business Essential</strong> provides digital solutions tailored for small businesses.
          Our services help manage payments, create and manage user accounts,
          and make information handling easier and more efficient.
          We aim to streamline your operations, boost productivity,
          and empower small businesses to grow in a simple and effective way.
        </p>
      </section>
    </div>
  );
}
