import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import "./ActivityInfo.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationArrow,
  faBookmark,
  faHome,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Footer from "./Footer";
import Calendar from "./Calendar";
import Header from "./Header";
import placeholder from "../components/assets/images/placeholder.jpg";

const ActivityInfo = () => {
  const location = useLocation(); // Access navigation state
  const { id: courseId } = useParams(); // Extract courseId from the URL
  const [course, setCourse] = useState(null);
  const [provider, setProvider] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State to track the current image index
  const navigate = useNavigate();
  useEffect(() => {
    if (!courseId) {
      console.error("No course ID provided");
      return;
    }

    const fetchCourseData = async () => {
      try {
        const courseResponse = await axios.get(
          `https://www.kidgage.com/api/courses/course/${courseId}`
        );
        setCourse(courseResponse.data);

        if (courseResponse.data && courseResponse.data.providerId) {
          const providerResponse = await axios.get(
            `https://www.kidgage.com/api/users/provider/${courseResponse.data.providerId}`
          );
          setProvider(providerResponse.data);
        } else {
          console.error("Provider ID is missing from course data");
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.error("Resource not found:", error.response.config.url);
        } else {
          console.error("Error fetching course or provider data:", error);
        }
      }
    };

    fetchCourseData();
  }, [courseId]); // Dependency on courseId

  // Function to decode and format base64 images
  const getBase64ImageSrc = (base64String) =>
    `data:image/jpeg;base64,${base64String}`;
  const handleLogoClick = () => {
    navigate("/home");
  };
  // Slideshow effect for images
  useEffect(() => {
    if (course && course.images && course.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % course.images.length
        ); // Cycle through images
      }, 3000); // 3 seconds interval

      return () => clearInterval(interval); // Cleanup on component unmount
    }
  }, [course]);
  const [wishlist, setWishlist] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const addToWishlist = (event) => {
    try {
      // Get current wishlist from local storage
      const storedWishlist = localStorage.getItem("wishlistEvents");
      const currentWishlist = storedWishlist ? JSON.parse(storedWishlist) : [];

      // Add the event to the wishlist if it's not already in it
      const isEventInWishlist = currentWishlist.some(
        (wishlistEvent) => wishlistEvent._id === event._id
      );
      if (!isEventInWishlist) {
        const updatedWishlist = [...currentWishlist, event];
        localStorage.setItem("wishlistEvents", JSON.stringify(updatedWishlist));
        setWishlist(updatedWishlist); // Update local wishlist state
        setShowPopup(true); // Show popup on success
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };
  const handleShare = () => {
    const shareData = {
      title: course?.name || "Check this out!",
      text: course?.description || "Check out this activity on Kidgage!",
      url: window.location.href,
    };

    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => console.log("Successfully shared"))
        .catch((error) => console.log("Error sharing", error));
    } else {
      alert("Web Share API is not supported in your browser.");
    }
  };

  if (!course || !provider) {
    return (
      <div className="activity-info-container">
        <Header />
        <div className="activity-info-content">
          <div className="activity-info-breadcrumb">
            <div className="activity-info-path">
              <FontAwesomeIcon
                icon={faHome}
                onClick={handleLogoClick}
                cursor="pointer"
              />
              <FontAwesomeIcon
                icon={faChevronRight}
                onClick={handleLogoClick}
                cursor="pointer"
              />
              Activity
            </div>
            <div className="activity-info-actions">
              <button
                className="activity-info-action-btn"
                onClick={handleShare}
              >
                <FontAwesomeIcon icon={faLocationArrow} /> Share
              </button>
              <button
                className="activity-info-action-btn"
                onClick={() => addToWishlist(course)}
              >
                <FontAwesomeIcon icon={faBookmark} /> Save
              </button>
            </div>
          </div>
          <div className="info-loading-dots">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  const formatFeeType = (feeType) => {
    return feeType
      .split("_") // Split by underscore
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(" "); // Join them with a space
  };
  return (
    <div className="activity-info-container">
      <Header />
      <div className="activity-info-content">
        <div className="activity-info-breadcrumb">
          <div className="activity-info-path">
            <FontAwesomeIcon
              icon={faHome}
              onClick={handleLogoClick}
              cursor="pointer"
            />
            <FontAwesomeIcon icon={faChevronRight} />
            Activity
          </div>
          <div className="activity-info-actions">
            <button className="activity-info-action-btn" onClick={handleShare}>
              <FontAwesomeIcon icon={faLocationArrow} /> Share
            </button>
            <button
              className="activity-info-action-btn"
              onClick={() => addToWishlist(course)}
            >
              <FontAwesomeIcon icon={faBookmark} /> Save
            </button>
          </div>
        </div>

        <h1 className="activity-info-heading">{course.name}</h1>
        <div className="activity-info-main">
          <div className="activity-info-left-section">
            {/* Display the current image in the slideshow */}
            {course.images && course.images.length > 0 ? (
              <img
                src={course.images[currentImageIndex]}
                alt={`activity-${currentImageIndex}`}
                className="activity-info-image"
              />
            ) : (
              <img src={placeholder} alt="Placeholder" />
            )}
            <h4 style={{ color: "darkblue" }}>
              QAR. {course.feeAmount} ({formatFeeType(course.feeType)})
            </h4>
            <p className="activity-info-description">{course.description}</p>
          </div>
          <div className="activity-info-right-section">
            <Calendar
              providerName={provider.username}
              courseName={course.name}
              url={window.location.href} // Pass the current URL
              feeAmount={course.feeAmount} // Pass the fee amount
              formattedFeeType={formatFeeType(course.feeType)} // Pass the formatted fee type
            />
          </div>
        </div>

        {/* Display course locations dynamically if available */}
        <div className="activity-info-locations">
          {course.location && course.location.length > 0 ? (
            course.location.map((loc, index) => (
              <div key={index} className="activity-info-location">
                <h3>Location {index + 1}</h3>
                <p>{loc.address}</p>
                <p> {loc.city}</p>
                <p>{loc.phoneNumber}</p>
                <a href={loc.link}>View Location</a>
              </div>
            ))
          ) : (
            <p>No locations available</p>
          )}
        </div>
        <div className="provider-trainer-container">
          <div className="activity-info-provider">
            <h2>Activity provided by</h2>
            <p>{provider.username}</p>
            <p>Commercial Registration: {provider.licenseNo}</p>
            <img
              src={provider.logo}
              alt="Provider"
              className="activity-info-provider-image"
            />
          </div>
          {/* <div className="activity-info-trainers">
                        <h2>Trainers</h2>
                        <div className="activity-info-trainer-images">
                            {[...Array(12)].map((_, index) => (
                                <img key={index} src={placeholder} alt={`trainer-${index + 1}`} className="activity-info-trainer-image" />
                            ))}
                        </div>
                    </div> */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ActivityInfo;
