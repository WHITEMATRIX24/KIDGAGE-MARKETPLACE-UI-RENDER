import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./TopProviders.css";

const TopProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <div className="slick-next">›</div>,
    prevArrow: <div className="slick-prev">‹</div>,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="top-prov-body">
      <div className="top-providers">
        <h2>Top Providers</h2>
        <p style={{ padding: "10px" }}>
          Partners in your child’s journey
        </p>
        {loading ? (
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : (
          <Slider {...settings}>
            {providers.map((provider, index) => (
              <div key={index} className="logo-slide">
                {provider.logo && (
                  <img
                    src={provider.logo}
                    alt={provider.username}
                    className="logo-image"
                  />
                )}
              </div>
            ))}
          </Slider>
        )}
      </div>
      <div className="badge-image">
        <h2>Looking to advertise an activity? We can help.</h2>
        <a href="/business-signup">
          <button className="list-your-academy-btn">List your academy</button>
        </a>
      </div>
    </div>
  );
};

export default TopProviders;
