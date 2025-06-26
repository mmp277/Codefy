import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  const phrases = [
    "Level Up Your Coding Skills with CodeYard",
    "Collaborate and Build Your Coding Community",
    "Explore and Solve Challenges Together"
  ];

  useEffect(() => {
    const i = loopNum % phrases.length;
    const fullText = phrases[i];

    const handleTyping = () => {
      setTypedText(prev =>
        isDeleting ? fullText.substring(0, prev.length - 1) : fullText.substring(0, prev.length + 1)
      );

      if (!isDeleting && typedText === fullText) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && typedText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }

      setTypingSpeed(isDeleting ? 40 : 60);
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [typedText, isDeleting, loopNum]);

  return (
    <div className="home-page">
      <div className="hero-section" style={{backgroundImage: "url(https://i.gifer.com/BLkE.gif)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)'}} >
        <h2 className="gradient-text" style={{fontFamily:'Consolas'}}>
          {typedText}
          <span className="cursor">|</span>
        </h2>
        <p style={{fontSize:'4.2vh', fontFamily:'Cursive'}}>Fuel your coding ambition</p>
        <div className="cta-buttons">
          <Link to="/LogIn" className="cta-button">Login</Link>
          <Link to="/SignUp" className="cta-button">Create a Profile</Link>
        </div>
      </div>

      <div className="features-section">
        <h2>Key Features</h2>
        <div className="features">
          <div className="feature">
            <div className="feature-icon">👤</div>
            <div className="feature-description">Showcase your skills, build your coding identity</div>
          </div>
          <div className="feature">
            <div className="feature-icon">🤝</div>
            <div className="feature-description">Work on coding questions together, get feedback</div>
          </div>
          <div className="feature">
            <div className="feature-icon">📅</div>
            <div className="feature-description">Stay on top of coding contests and events</div>
          </div>
          <div className="feature">
            <div className="feature-icon">💬</div>
            <div className="feature-description">Join themed discussions and code collaboratively</div>
          </div>
          <div className="feature">
            <div className="feature-icon">💻</div>
            <div className="feature-description">Write, test, and debug your code with ease</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
