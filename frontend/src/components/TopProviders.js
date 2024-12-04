import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./TopProviders.css";

const TopProviders = () => {
  const [position, setPosition] = useState(0);
  const [providers, setProviders] = useState([]);
  const [imageWidth, setImageWidth] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const logoSliderRef = useRef(null);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await axios.get(
          "https://www.kidgage.com/api/users/all"
        );
        setProviders(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching providers:", error);
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  useEffect(() => {
    if (logoSliderRef.current && providers.length > 0) {
      const slides = logoSliderRef.current.querySelectorAll(".logo-slide");
      if (slides.length > 0) {
        setImageWidth(slides[0].offsetWidth);
        const numSlides = providers.length;
        setSliderWidth(numSlides * slides[0].offsetWidth);
        setMounted(true);
      }
    }
  }, [providers]);

  useEffect(() => {
    if (mounted) {
      setPosition(-imageWidth / 2);
    }
  }, [mounted, imageWidth]);

  useEffect(() => {
    let interval;
    if (providers.length > 5) {
      interval = setInterval(() => {
        setPosition((prevPosition) => {
          const slideWidth = imageWidth || 0;
          const newPosition = prevPosition - slideWidth;
          if (Math.abs(newPosition) >= sliderWidth) {
            return -imageWidth / 2;
          }
          return newPosition;
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [providers.length, imageWidth, sliderWidth]);

  const activeDot = Math.floor(
    Math.abs(position + imageWidth / 2) / (imageWidth || 1)
  );
  const dotCount = providers.length > 4 ? providers.length - 4 : 0;

  return (
    <div className="top-prov-body">
      <div className="top-providers">
        <h2>Top Providers</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
          massa lacus.
        </p>
        {loading ? (
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : (
          <>
            <div className="logo-container">
              <div
                className="logo-slider"
                style={{ transform: `translateX(${position}px)` }}
                ref={logoSliderRef}
              >
                {providers.map((provider, index) => (
                  <div key={index} className="logo-slide">
                    {provider.logo && (
                      <img src={provider.logo} alt={provider.username} />
                    )}
                  </div>
                ))}
              </div>
            </div>
            {providers.length > 4 && dotCount > 0 && (
              <div className="provider-dots">
                {[...Array(dotCount)].map((_, index) => (
                  <span
                    key={index}
                    className={`provider-dot ${
                      index === activeDot ? "active" : ""
                    }`}
                  ></span>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <div className="badge-image">
        <h2>Looking to advertise an activity? We can help.</h2>
        <Link to="/business-signup">
          <button className="list-your-academy-btn">List your academy</button>
        </Link>
      </div>
    </div>
  );
};

export default TopProviders;
