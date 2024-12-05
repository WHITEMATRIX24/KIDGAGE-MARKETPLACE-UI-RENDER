import React, { useState, useEffect } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import logo from "./assets/images/Kidgage logo_horizontal_black.png";
import bell from "./assets/images/bell.png";
import CitySelector from "./CitySelector";
import hamburger from "./assets/images/hamburger.png";
import Login from "./Login";
import gift from "./assets/images/gift1.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [city, setCity] = useState(localStorage.getItem("selectedCity") || "");
  const [isCitySelectorOpen, setIsCitySelectorOpen] = useState(false);
  const navigate = useNavigate();

  // Handle city selection
  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
    localStorage.setItem("selectedCity", selectedCity);
    setIsCitySelectorOpen(false);
  };

  // Function to close the CitySelector modal
  const handleCitySelectorClose = () => {
    setIsCitySelectorOpen(false);
  };

  // Toggle the menu for the hamburger icon
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle logo click navigation
  const handleLogoClick = () => {
    navigate("/home");
  };
  const handleClick = () => {
    navigate("/shops");
  };
  // Disable scrolling when the city selector modal is open
  // useEffect(() => {
  //     if (isCitySelectorOpen) {
  //         document.body.style.overflow = 'hidden';
  //     } else {
  //         document.body.style.overflow = 'unset';
  //     }
  // }, [isCitySelectorOpen]);

  // Show city selector after 3 seconds if no city is selected
  // useEffect(() => {
  //     if (!city) {
  //         const timer = setTimeout(() => {
  //             setIsCitySelectorOpen(true);
  //         }, 1000);
  //         return () => clearTimeout(timer);
  //     }
  // }, [city]);

  return (
    <header className="home-headers">
      <div className="notification-bar">
        <img className="bell-icon" src={bell} alt="Notification" />
        Are you an activity provider?{" "}
        <a href="/business-signup">Learn how to be listed</a>
      </div>
      <div className="header-content">
        <div className="home-logo" onClick={handleLogoClick}>
          <img src={logo} alt="KIDGAGE" style={{ cursor: "pointer" }} />
        </div>
        <div className="city-section">
          <span className="selected-city">
            {/* <img 
                        src={gift} 
                        alt="Menu" 
                        className="menu-icon" 
                        onClick={handleClick}
                    /> */}
          </span>
          <button className="menu-toggle" onClick={toggleMenu}>
            <img src={hamburger} alt="Menu" className="menu-icon" />
          </button>
        </div>
      </div>
      {isMenuOpen && <Login closeMenu={toggleMenu} />}
      {/* {isCitySelectorOpen && (
                <CitySelector onCitySelect={handleCitySelect} onClose={handleCitySelectorClose} />
            )} */}
    </header>
  );
};

export default Header;
