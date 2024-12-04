import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ActivityInfo.css";
import "./Provider.css";
import calendar from "../components/assets/images/calendar.png";
import baby from "../components/assets/images/baby.png";
import boy from "../components/assets/images/boy.png";
import girl from "../components/assets/images/girl.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationArrow,
  faBookmark,
  faHome,
  faChevronRight,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Footer from "./Footer";
import Header from "./Header";
import placeholder from "./assets/images/placeholder.jpg";
import verified from "./assets/images/ver.png";
const ProviderInfo = () => {
  const location = useLocation();
  const { provider } = location.state || {}; // Get provider from state
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch courses by providerId
  useEffect(() => {
    if (provider && provider._id) {
      axios
        .get("https://www.kidgage.com/api/courses/by-providers", {
          params: {
            providerIds: [provider._id], // Sending providerId in query
          },
        })
        .then((response) => {
          setCourses(response.data); // Set the courses to state
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching courses:", error);
          setLoading(false);
        });
    }
  }, [provider]);
  const calculateAgeRange = (startDate, endDate) => {
    const today = new Date();

    // Convert ISO strings to Date objects
    let start = new Date(startDate);
    let end = new Date(endDate);

    // Check if both dates are valid
    if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
      return "unavailable";
    }

    // Helper function to calculate the difference in years and months
    const calculateDifference = (fromDate, toDate) => {
      let years = toDate.getFullYear() - fromDate.getFullYear();
      let months = toDate.getMonth() - fromDate.getMonth();

      // Adjust if the month difference is negative
      if (months < 0) {
        years--;
        months += 12;
      }

      // Ensure years and months are not negative
      if (years < 0 || months < 0) {
        return { years: 0, months: 0 };
      }

      return { years, months };
    };

    // Calculate the differences from both start and end dates to today
    const startDiff = calculateDifference(start, today);
    const endDiff = calculateDifference(end, today);

    // Function to format the age in 'x years y months' format
    const formatAge = ({ years, months }) => {
      let ageString = `${years} yr`;
      if (months > 0) {
        ageString += ` ${months} mo`;
      }
      return ageString;
    };

    // Sort the age differences to always display the smallest age first
    const sortedAges = [startDiff, endDiff].sort((a, b) => {
      if (a.years === b.years) {
        return a.months - b.months;
      }
      return a.years - b.years;
    });

    // Return the age range in 'smallest-age-to-largest-age' format with years and months
    return `${formatAge(sortedAges[0])} - ${formatAge(sortedAges[1])}`;
  };

  const calculateAgeRanges = (ageRanges) => {
    const today = new Date();

    // Variables to store the overall lowest start age and highest end age
    let overallLowestStartAge = null;
    let overallHighestEndAge = null;

    // Helper function to calculate the difference in years and months
    const calculateDifference = (fromDate, toDate) => {
      let years = toDate.getFullYear() - fromDate.getFullYear();
      let months = toDate.getMonth() - fromDate.getMonth();

      // Adjust if the month difference is negative
      if (months < 0) {
        years--;
        months += 12;
      }

      // Ensure years and months are not negative
      if (years < 0 || months < 0) {
        return { years: 0, months: 0 };
      }

      return { years, months };
    };

    // Function to format the age in 'x years y months' format
    const formatAge = ({ years, months }) => {
      let ageString = `${years} yr`;
      if (months > 0) {
        ageString += ` ${months} mo`;
      }
      return ageString;
    };

    ageRanges.forEach(([startDate, endDate]) => {
      // Convert ISO strings to Date objects
      let start = new Date(startDate);
      let end = new Date(endDate);

      // Check if both dates are valid
      if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
        return; // Skip invalid dates
      }

      // Calculate the differences from both start and end dates to today
      const startDiff = calculateDifference(start, today);
      const endDiff = calculateDifference(end, today);

      // Update overall lowest and highest ages
      if (
        overallLowestStartAge === null ||
        startDiff.years < overallLowestStartAge.years ||
        (startDiff.years === overallLowestStartAge.years &&
          startDiff.months < overallLowestStartAge.months)
      ) {
        overallLowestStartAge = startDiff;
      }

      if (
        overallHighestEndAge === null ||
        endDiff.years > overallHighestEndAge.years ||
        (endDiff.years === overallHighestEndAge.years &&
          endDiff.months > overallHighestEndAge.months)
      ) {
        overallHighestEndAge = endDiff;
      }
    });

    // Format the overall lowest and highest ages
    const lowestAgeFormatted = overallLowestStartAge
      ? formatAge(overallLowestStartAge)
      : "unavailable";
    const highestAgeFormatted = overallHighestEndAge
      ? formatAge(overallHighestEndAge)
      : "unavailable";

    // Return results
    return {
      ageRanges: `${lowestAgeFormatted} - ${highestAgeFormatted}`,
      lowestStartAge: lowestAgeFormatted,
      highestEndAge: highestAgeFormatted,
    };
  };

  // Example usage
  const ageRanges = [
    ["2000-01-01", "2015-01-01"], // Range 1
    ["2010-01-01", "2020-01-01"], // Range 2
    ["2015-03-10", "2024-10-01"], // Range 3
  ];

  const result = calculateAgeRanges(ageRanges);
  console.log(result);

  const allDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const getGenderImage = (preferredGender) => {
    if (preferredGender === "Male") {
      return boy;
    } else if (preferredGender === "Female") {
      return girl;
    } else {
      return baby; // Default to 'Any' or not mentioned
    }
  };
  const formatFeeType = (feeType) => {
    return feeType
      .split("_") // Split by underscore
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(" "); // Join them with a space
  };
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
  const handleShare = (courseName, courseId) => {
    const shareData = {
      title: courseName || "Check this out!", // Use the course name
      text: `Check out this course on Kidgage!`,
      url: `${window.location.origin}/activity-info/${courseId}`, // Construct the URL dynamically with the course ID
    };

    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => console.log("Shared successfully:", shareData))
        .catch((error) => console.log("Error sharing:", error));
    } else {
      alert("Web Share API is not supported in your browser.");
    }
  };

  const sendMessage = (
    activityName,
    providerName,
    activityId,
    fee,
    feetype
  ) => {
    const link = `${window.location.origin}/activity-info/${activityId}`;
    const message = `
        Hello!
        
        I am interested in booking the *${activityName}* provided by *${providerName}*. 
        
        Here are the details:
        - **Link**: ${link}
        - **Fee**: QAR ${fee} (${feetype})
        
        Could you please provide more information? 
        
        Thank you!
        `;
    const whatsappUrl = `https://wa.me/97477940018?text=${encodeURIComponent(
      message
    )}`;
    console.log("WhatsApp URL:", whatsappUrl); // Log the URL for debugging
    window.open(whatsappUrl, "_blank");
  };
  const [visibleCourses, setVisibleCourses] = useState(3); // Default to 3 courses
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Function to update the number of visible courses based on window width
  const updateVisibleCourses = (width) => {
    if (width > 2500) {
      setVisibleCourses(8);
    } else if (width > 1100) {
      setVisibleCourses(6);
    } else if (width > 720) {
      setVisibleCourses(4);
    } else {
      setVisibleCourses(3);
    }
  };

  // Effect to handle window resize and adjust visible courses
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      updateVisibleCourses(window.innerWidth);
    };

    // Set the initial value
    updateVisibleCourses(window.innerWidth);

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Function to handle "See More" button click
  const handleSeeMore = () => {
    setVisibleCourses((prevVisibleCourses) =>
      Math.min(prevVisibleCourses + 6, courses.length)
    );
  };

  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate("/home");
  };
  const handleClick = (courseId) => {
    navigate(`/activity-info/${courseId}`, { state: { id: courseId } });
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
            Provider
          </div>
        </div>

        <div className="provider-container">
          <div className="container">
            <div className="pro-image">
              <img
                src={
                  provider?.academyImg ? provider.academyImg : "defaultImageUrl"
                }
                alt="Provider"
              />
            </div>
            <div className="total-contain">
              <div className="logo-contain">
                <h1>{provider.username}</h1>
                <p>{provider.description}</p>
              </div>
              {/* <img
                src={`data:image/jpeg;base64,${provider.logo}`}
                alt="Provider"
                className="pro-logoimage"
              /> */}
            </div>
            <div
              className="verified-div"
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: "10px",
              }}
            >
              <img
                src={verified}
                style={{ height: "20px", width: "auto", marginRight: "5px" }}
              ></img>
              <p style={{ fontWeight: "bold", color: "darkblue" }}>
                Verified by Kidgage
              </p>
            </div>
            <div></div>
          </div>
          {/* 
                    <div>
                        
                        <p>{provider.email}</p>
                        <p>{provider.phoneNumber}</p>
                        <p>{provider.licenseNo}</p>
                    </div> */}
        </div>

        {/* Display courses */}
        <div className="container">
          <div className="provider-courses">
            <h2>Courses Offered by {provider.username}</h2>
            {loading ? (
              <div className="prov-loading-dots">
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            ) : (
              <>
                {courses.length > 0 ? (
                  <ul className="pr-courses-list">
                    {courses.slice(0, visibleCourses).map((course) => (
                      <div className="pr-activity-card" key={course._id}>
                        <div
                          className="pr-activity-image"
                          onClick={() => handleClick(course._id)}
                        >
                          {/* Display image if available */}
                          {course.images && course.images.length > 0 ? (
                            <img src={course.images[0]} alt="Course Image" />
                          ) : (
                            <img src={placeholder} alt="Course Image" />
                          )}
                          {course.promoted && (
                            <div className="promoted-overlay">
                              <div className="promoted-label">Promoted</div>
                            </div>
                          )}
                        </div>
                        <div className="pr-activity-details">
                          <div
                            className="pr-activity-card-in"
                            onClick={() => handleClick(course._id)}
                          >
                            <div className="pr-info-with-img">
                              <div className="pr-descp">
                                <h3>{course.name}</h3>
                                <div
                                  style={{ display: "flex", marginLeft: "5px" }}
                                >
                                  {/* Display location if available */}
                                  {course.location &&
                                  course.location.length > 0 ? (
                                    course.location.map((loc, index) => (
                                      <div
                                        key={index}
                                        className="pr-activity-location"
                                      >
                                        <p
                                          style={{
                                            marginRight: "8px",
                                            fontSize: "smaller",
                                          }}
                                        >
                                          <FontAwesomeIcon
                                            icon={faLocationArrow}
                                            style={{ marginRight: "5px" }}
                                          />
                                          {loc.address}
                                        </p>
                                      </div>
                                    ))
                                  ) : (
                                    <p>No locations available</p>
                                  )}
                                </div>
                                <div className="pr-act-location">
                                  <img
                                    src={getGenderImage(course.preferredGender)}
                                    alt="gender"
                                    style={{
                                      width: "auto",
                                      height: "20px",
                                      marginRight: "10px",
                                    }}
                                  />

                                  <div className="age-group">
                                    {course.ageGroup &&
                                    course.ageGroup.length > 0 ? (
                                      <span className="age-text">
                                        {calculateAgeRange(
                                          course.ageGroup[0].ageStart,
                                          course.ageGroup[0].ageEnd
                                        )}
                                      </span>
                                    ) : (
                                      <span className="age-text">
                                        Unavailable
                                      </span>
                                    )}
                                  </div>
                                  <br></br>

                                  <div
                                    className="day-selector"
                                    style={{ width: "50%" }}
                                  >
                                    <img
                                      src={calendar}
                                      alt="calendar"
                                      style={{
                                        width: "auto",
                                        marginRight: "10px",
                                        height: "20px",
                                        marginTop: "1%",
                                      }}
                                    />

                                    {allDays.map((day) => (
                                      <span
                                        key={day}
                                        className={`day ${
                                          course.days.includes(day)
                                            ? "active"
                                            : ""
                                        }`}
                                      >
                                        {day}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div className="pr-description-container">
                                  <p className="pr-activity-description">
                                    {course.description ||
                                      "No description available"}
                                  </p>
                                </div>
                              </div>
                              <div
                                className="gap-after"
                                style={{ height: "3px" }}
                              ></div>
                            </div>
                          </div>

                          {/* Activity Actions Section */}
                          <div className="activity-actions">
                            <div className="activity-buttons">
                              <button
                                className="book-now"
                                style={{ backgroundColor: "#5EA858" }}
                                onClick={() => {
                                  const providerName = provider
                                    ? provider.username
                                    : "Unknown Provider";
                                  sendMessage(
                                    course.name,
                                    providerName,
                                    course._id,
                                    course.feeAmount,
                                    formatFeeType(course.feeType)
                                  );
                                }}
                              >
                                <i className="fa-brands fa-whatsapp"></i>
                                <span
                                  style={{
                                    marginLeft: "5px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Book Now
                                </span>
                              </button>

                              <button
                                className="share"
                                style={{ backgroundColor: "#3880C4" }}
                                onClick={() =>
                                  handleShare(course.name, course._id)
                                }
                              >
                                <i className="fa-solid fa-share"></i>
                                <span
                                  style={{
                                    marginLeft: "5px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Share
                                </span>
                              </button>

                              <button
                                className="save"
                                style={{ backgroundColor: "#3880C4" }}
                                onClick={() => addToWishlist(course)}
                              >
                                <FontAwesomeIcon icon={faBookmark} />
                                <span
                                  style={{
                                    marginLeft: "5px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Save
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </ul>
                ) : (
                  <p>No courses available from this provider.</p>
                )}
              </>
            )}
          </div>
          {visibleCourses < courses.length && (
            <div className="see-more-cont">
              <button className="see-more-more" onClick={handleSeeMore}>
                See More <FontAwesomeIcon icon={faChevronDown} />
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProviderInfo;
