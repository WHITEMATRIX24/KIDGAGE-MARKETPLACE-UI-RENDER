import React, { useState, useEffect } from "react";
import ChatbotPage from "./ChatbotPage"; // Import the ChatbotPage component
import chatbotImage from "./assets/images/chatbot.png"; // Import the chatbot image
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebook,
  faLinkedin,
  faYoutube,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import "./Footer.css";
import logoimage from "./assets/images/KIDGAGE-28.png";
const Footer = () => {
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();

  const viewWishlist = () => {
    navigate("/wishlist"); // Replace '/wishlist' with the path to your wishlist page
  };

  const viewCart = () => {
    navigate("/shops"); // Replace '/cart' with the path to your cart page
  };
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src={logoimage} alt="KIDGAGE" className="footer-logo-image" />
        </div>
        <div className="footer-links">
          <nav className="footer-nav">
            <>
              <a href="/about">About</a>
              <span className="separator">|</span>
              <a href="/terms">Terms & Conditions</a>
              <span className="separator">|</span>
              <a href="/privacy">Privacy Policy</a>
              <span className="separator">|</span>
            </>
            <>
              <a href="/contact">Contact Us</a>
              <span className="separator">|</span>
              <a href="/blog">Blog</a>
              <span className="separator">|</span>
              <a href="/careers">Careers</a>
            </>
          </nav>
          <div className="footer-copyright">Copyright © 2024 Kidgage</div>
        </div>
        <div className="footer-social">
          <a href="https://instagram.com/mykidgage" aria-label="Instagram">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          {/* <a href="https://facebook.com" aria-label="Facebook">
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a href="https://x.com/" aria-label="Twitter">
            <FontAwesomeIcon icon={faXTwitter} />
          </a> */}
          <a href="https://www.linkedin.com/company/kidgage" aria-label="LinkedIn">
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          {/* <a href="https://youtube.com" aria-label="YouTube">
            <FontAwesomeIcon icon={faYoutube} />
          </a> */}
        </div>
      </div>
      {/* <button className="floating-btn wishlist-btn" onClick={viewWishlist}>
        <i className="fa-solid fa-heart"></i>
      </button> */}
      {/* <button className="floating-btn cart-btn" onClick={() => setShowChat(!showChat)}>
        <img src={chatbotImage} alt="Chatbot" style={{ marginTop:'0px', width: '95%', height: 'auto',minWidth: '30px', minHeight: '30px' }} /> 
      </button> */}
      {showChat && (
        <div className="chatbot-container">
          <ChatbotPage />
        </div>
      )}
    </footer>
  );
};

export default Footer;
