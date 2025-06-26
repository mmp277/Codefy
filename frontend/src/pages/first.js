import Navbar2 from "../components/Navbar2";
import { useEffect,useState } from "react";
import "./Profile/dashboard.css";
import React from "react";
import "./Home/HomePage.css";

const First = () => {
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  const phrases = [
    "Level Up Your Coding Skills with CodeYard",
    "Collaborate and Solve Problems Together",
    "Build Your Coding Identity and Profile",
  ];

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      setTypedText((prev) =>
        isDeleting
          ? fullText.substring(0, prev.length - 1)
          : fullText.substring(0, prev.length + 1)
      );

      setTypingSpeed(isDeleting ? 40 : 60);

      if (!isDeleting && typedText === fullText) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && typedText === "") {
        setIsDeleting(false);
        setLoopNum((prev) => prev + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [typedText, isDeleting, loopNum]);

  return (
    <>
      <Navbar2 />
      <div
        className="home-page"
      >
        <div className="hero-section" style={{ paddingBottom: "1vh",backgroundImage: "url(https://i.gifer.com/BLkE.gif)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)'}}>
          <h2 style={{ fontFamily: "Consolas", }}>
            {typedText}
            <span className="cursor" style={{}}>|</span>
          </h2>
          <div></div>
          <p style={{ fontSize: "3.5vh", fontFamily: "Cursive",textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)'}}>
            Fuel your coding ambition now
          </p> 
        </div>
        <div className="features-section">
          <h2>Key Features</h2>
          <div className="features">
            <div className="feature">
              <div className="feature-icon">👤</div>
              <div className="feature-description">
                Showcase your skills, build your coding identity
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">🤝</div>
              <div className="feature-description">
                Work on coding questions together, get feedback
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">📅</div>
              <div className="feature-description">
                Stay on top of coding contests and events
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">💬</div>
              <div className="feature-description">
                Join themed discussions and code collaboratively
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">💻</div>
              <div className="feature-description">
                Write, test, and debug your code with ease
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default First;
