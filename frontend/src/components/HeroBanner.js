import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HeroBanner.css";

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get("https://www.kidgage.com/api/banners");
        console.log("Fetched banners:", response.data);

        // Filter banners with activeStatus set to true
        const activeBanners = response.data.filter(
          (banner) => banner.status === true
        );
        setSlides(activeBanners);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching banners:", error);
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (slides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [slides.length]);

  const getSlideStyle = (index) => {
    let offset = ((index - currentSlide + slides.length) % slides.length) - 1;
    return {
      transform: `translateX(calc(${offset * 100}% + ${offset * 10}px))`,
      opacity: Math.abs(offset) <= 1 ? 1 : 0.5,
    };
  };

  return (
    <div className="hero-banner">
      {loading ? (
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      ) : (
        <>
          <div className="hero-slider-container">
            {slides.length > 0 &&
              [...slides, slides[0]].map((slide, index) => (
                <a
                  key={`${slide._id || index}-${index}`}
                  href={slide.bookingLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-slide"
                  style={getSlideStyle(index)}
                >
                  {slide.imageUrl ? (
                    <img src={slide.imageUrl} alt={slide.title} />
                  ) : (
                    <div className="placeholder">Image not available</div>
                  )}
                </a>
              ))}
          </div>
          <div className="hero-dots">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`hero-dot ${index === currentSlide ? "active" : ""}`}
                onClick={() => setCurrentSlide(index)}
              ></span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroBanner;
