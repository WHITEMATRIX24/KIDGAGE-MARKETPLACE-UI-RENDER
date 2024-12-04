import React, { useState } from 'react';
import './CitySelector.css';

const CitySelector = ({ onCitySelect, onClose }) => {
  const [selectedCity, setSelectedCity] = useState('');

  const handleCityClick = (city) => {
    setSelectedCity(city);
    onCitySelect(city);
    onClose(); // Close the modal after selection
  };
  return (
    <div className="city-selector-overlay">
      <div className="city-selector-modal">
        <h5>Select Your Nearest City</h5>
        <ul>
          {["Doha", "Al Wakrah", "Al Khor", "Al Rayyan", "Al Shamal", "Al Shahaniya","Al Daayen", "Umm Salal", "Dukhan", "Mesaieed"].map((city) => (
            <li key={city} onClick={() => handleCityClick(city)}>
              {city}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CitySelector;
