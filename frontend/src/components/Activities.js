import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import football from "../components/assets/images/placeholder.jpg";
import placeholderLogo from "../components/assets/images/placeholder.jpg";
import calendar from "../components/assets/images/calendar.png";
import baby from "../components/assets/images/baby.png";
import boy from "../components/assets/images/boy.png";
import girl from "../components/assets/images/girl.png";

import "./Activities.css";
import Footer from "./Footer";
import Header from "./Header";
import SearchBar from "./SearchBar";
import axios from "axios";
import { useLocation } from "react-router-dom";
const allDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Activities = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const location = useLocation();
  const { id, name } = useParams();
  const decodedName = decodeURIComponent(name);
  const { category: initialCategoryFromState } = location.state || {};
  const [initialCategory, setInitialCategory] = useState(
    initialCategoryFromState || decodedName
  );
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadinga, setLoadinga] = useState(true);
  const [error, setError] = useState(null);
  const [ageRange, setAgeRange] = useState({});
  const [providers, setProviders] = useState({}); // Change to an object to map providerId to provider details
  const [searchParams, setSearchParams] = useState(initialCategory || null); // Initialize with location category or null
  const [desktopBanners, setDesktopBanners] = useState([]);
  const [mobileBanners, setMobileBanners] = useState([]);
  const [currentDesktopIndex, setCurrentDesktopIndex] = useState(0);
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0);
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const [desktopResponse, mobileResponse] = await Promise.all([
          axios.get("https://www.kidgage.com/api/desktop-banners/"),
          axios.get("https://www.kidgage.com/api/mobile-banners/"),
        ]);

        // Filter banners with activeStatus set to true
        const activeDesktopBanners = desktopResponse.data.filter(
          (banner) => banner.status === true
        );
        const activeMobileBanners = mobileResponse.data.filter(
          (banner) => banner.status === true
        );

        setDesktopBanners(activeDesktopBanners);
        setMobileBanners(activeMobileBanners);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();

    // Handle screen size changes
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1025);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Rotate banners every 3 seconds
  useEffect(() => {
    const desktopInterval = setInterval(() => {
      setCurrentDesktopIndex(
        (prevIndex) => (prevIndex + 1) % desktopBanners.length
      );
    }, 3000);

    const mobileInterval = setInterval(() => {
      setCurrentMobileIndex(
        (prevIndex) => (prevIndex + 1) % mobileBanners.length
      );
    }, 3000);

    return () => {
      clearInterval(desktopInterval);
      clearInterval(mobileInterval);
    };
  }, [desktopBanners.length, mobileBanners.length]);

  const getCurrentDesktopImage = () =>
    desktopBanners.length > 0 ? desktopBanners[currentDesktopIndex] : null;

  const getCurrentMobileImage = () =>
    mobileBanners.length > 0 ? mobileBanners[currentMobileIndex] : null;
  useEffect(() => {
    // Update initialCategory whenever the URL or state changes
    setInitialCategory(initialCategoryFromState || decodedName);
  }, [initialCategoryFromState, decodedName]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1025);
    };

    // Check the screen size when the component
    handleResize();

    // Add event listener to check the window size on resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
  const navigate = useNavigate();

  const handleClick = (courseId) => {
    navigate(`/activity-info/${courseId}`, { state: { id: courseId } });
  };
  const formatFeeType = (feeType) => {
    return feeType
      .split("_") // Split by underscore
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(" "); // Join them with a space
  };
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

  const fetchCourses = async (category) => {
    if (!category) return; // Avoid fetching if no category is provided
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "https://www.kidgage.com/api/courses/by-course-type",
        {
          params: { courseType: category },
        }
      );

      console.log("API Response:", response.data);

      if (response.data && Array.isArray(response.data)) {
        setCourses(response.data); // Set courses in state

        // Fetch provider data for each course
        const providerPromises = response.data.map(async (course) => {
          if (course.providerId) {
            try {
              const providerResponse = await axios.get(
                `https://www.kidgage.com/api/users/provider/${course.providerId}`
              );
              console.log(
                `Provider Response for course ${course._id}:`,
                providerResponse.data
              );

              return { [course.providerId]: providerResponse.data }; // Return provider data mapped by providerId
            } catch (providerError) {
              console.error(
                `Error fetching provider for course ${course._id}:`,
                providerError
              );
              return null;
            }
          } else {
            console.error(`Provider ID is missing for course ${course._id}`);
            return null;
          }
        });

        // Wait for all providers to be fetched
        const providersArray = await Promise.all(providerPromises);

        // Combine all providers into a single object
        const providersObject = providersArray.reduce((acc, provider) => {
          if (provider) {
            return { ...acc, ...provider };
          }
          return acc;
        }, {});

        setProviders(providersObject); // Set providers in state
      } else {
        console.error("Course data is empty or not an array");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError("Error fetching courses");
      setLoading(false);
    }
  };

  // Trigger fetching courses based on both location-based category or searchParams
  useEffect(() => {
    const categoryToFetch = searchParams || initialCategory; // Prefer searchParams over location
    if (categoryToFetch) {
      fetchCourses(categoryToFetch);
    }
  }, [searchParams, initialCategory]); // Rerun if searchParams or location category changes
  const [selectedLocation, setSelectedLocation] = useState("Location");
  const [selectedDob, setSelectedDob] = useState("Age");
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchInitiated, setSearchInitiated] = useState(false); // Track if a search has been initiated

  // Function to handle search
  const handleSearch = (searchData) => {
    const { selectedLocation, selectedDob, selectedDate } = searchData;
    setSelectedLocation(selectedLocation); // Save the selected location in state
    setSelectedDob(selectedDob); // Save the selected DOB in state
    setSelectedDate(selectedDate); // Save the selected date in state
    const selectedActivity = searchData.selectedActivity;
    setSearchParams(selectedActivity); // Set the selected activity in state
    console.log("Received search data:", searchData);
    setSearchInitiated(true);
    // Fetch courses for the selected activity
    fetchCourses(selectedActivity);
  };

  // Define handleShare as a separate function
  // Define handleShare function to accept course name and id
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

  // const fetchAdvertisements = async () => {
  //     try {
  //         const response = await axios.get('https://www.kidgage.com/api/advertisement');
  //         setAdvertisements(response.data);
  //         setLoadinga(false);
  //     } catch (error) {
  //         console.error('Error fetching advertisements:', error);
  //         setLoadinga(false);
  //     }
  // };
  // const getAdsBySpace = (space) => {
  //     return advertisements.filter(ad => ad.space === space);
  // };
  // const getMobileImages = () => {
  //     const space1MobileImages = advertisements.filter(ad => ad.space === 1).map(ad => ad.mobileImage);
  //     const space2MobileImages = advertisements.filter(ad => ad.space === 2).map(ad => ad.mobileImage);
  //     return [...space1MobileImages, ...space2MobileImages]; // Merge mobile images from both spaces
  // };
  // const [currentMobileAdIndex, setCurrentMobileAdIndex] = useState(0)
  // Start interval for cycling through mobile ads
  // useEffect(() => {
  //     if (isSmallScreen) { // Check if the screen is small
  //         const mobileInterval = setInterval(() => {
  //             setCurrentMobileAdIndex((prevIndex) => {
  //                 const mobileAds = getMobileImages(); // Get combined mobile images
  //                 if (mobileAds.length === 0) return prevIndex; // Skip if no ads available
  //                 return (prevIndex + 1) % mobileAds.length; // Cycle through mobile ads
  //             });
  //         }, 3000);

  //         return () => clearInterval(mobileInterval);
  //     }
  // }, [advertisements, isSmallScreen]);
  // Start interval for space 1 ads
  // useEffect(() => {
  //     const space1Interval = setInterval(() => {
  //         setCurrentAdIndex((prevIndex) => {
  //             const space1Ads = getAdsBySpace(1);
  //             if (space1Ads.length === 0) return prevIndex; // Skip if no ads available
  //             return {
  //                 ...prevIndex,
  //                 space1: (prevIndex.space1 + 1) % space1Ads.length,
  //             };
  //         });
  //     }, 3000);

  //     return () => clearInterval(space1Interval);
  // }, [advertisements]);

  // useEffect(() => {
  //     const space2Interval = setInterval(() => {
  //         setCurrentAdIndex((prevIndex) => {
  //             const space2Ads = getAdsBySpace(2);
  //             if (space2Ads.length === 0) return prevIndex; // Skip if no ads available
  //             return {
  //                 ...prevIndex,
  //                 space2: (prevIndex.space2 + 1) % space2Ads.length,
  //             };
  //         });
  //     }, 4000);

  //     return () => clearInterval(space2Interval);
  // }, [advertisements]);

  const [isExpanded, setIsExpanded] = useState(false);

  const getGenderImage = (preferredGender) => {
    if (preferredGender === "Male") {
      return boy;
    } else if (preferredGender === "Female") {
      return girl;
    } else {
      return baby; // Default to 'Any' or not mentioned
    }
  };
  const handleNavigate = (providerId) => {
    const provider = providers[providerId]; // Get the provider object using the providerId
    navigate(`/providerinfo`, { state: { provider } }); // Pass providerId in URL and provider object in state
  };

  const ageGroupMappings = {
    "0-2 years": { min: 0, max: 2 },
    "3-5 years": { min: 3, max: 5 },
    "6-8 years": { min: 6, max: 8 },
    "9-12 years": { min: 9, max: 12 },
    "13-17 years": { min: 13, max: 17 },
  };

  const isAgeGroupMatch = (ageRange, selectedDob) => {
    if (!selectedDob) return true; // If no age group is selected, return true

    const [startAge, endAge] = ageRange.split(" - ").map((age) => {
      const [years] = age.split(" "); // Get only the years part
      return parseInt(years, 10); // Convert to number
    });

    const { min, max } = ageGroupMappings[selectedDob] || { min: 0, max: 0 };

    // Check if the course age range is within the selected age group
    return (
      (min >= startAge && min <= endAge) || (min >= endAge && min <= startAge)
    );
  };

  // // Function to handle search
  // const handleSearch = (searchData) => {
  //   setSearchParams(searchData);
  //   console.log('Received search data:', searchData);

  //   // You can now use the `searchData` to make API requests or filter data.
  //   // For example:
  //   // fetchData(searchData);
  // };

  return (
    <>
      {/* Fixed Navbar */}
      <Header />
      <SearchBar onSearch={handleSearch} />

      {/* promoted */}
      <div style={{ height: "22px" }}></div>

      {/* <div className='promoted-container'> */}
      {/* promoted card 1 */}

      {/* {courses.length > 0 ? (
                    courses
                        .filter((course) => course.promoted) // Filter to only include promoted courses
                        .map((activity) => (
                            <div key={activity._id} className="promoted-card "> */}
      {/* <div className="promoted-image" onClick={() => handleClick(activity._id)}>
                                    {activity.images && activity.images.length > 0 ? (
                                        <img src={`data:image/png;base64,${activity.images[0]}`} alt="Activity Image" />
                                    ) : (
                                        <img src={football} alt="Placeholder" />
                                    )}
                                    <div className="promoted-overlay">
                                        <div className="promoted-label">Promoted</div>
                                    </div>
                                </div> */}
      {/* <div className="activity-detailss" onClick={() => handleClick(activity._id)}>
                                    <h3>{activity.name}</h3>
                                    <div className='info-with-img'>
                                        <div className='pdescp'>
                                            <div>
                                                <p className="location"> */}
      {/* <i className="fa-solid fa-location-dot"></i> */}
      {/* <span style={{ color: '#5EA858', fontWeight: 'bold' }}>QAR.    {`${activity.feeAmount} (${formatFeeType(activity.feeType)})`}

                                                    </span> */}

      {/* </p>
                                            </div>
                                            <div className="infop-row">
                                            <img src={getGenderImage(activity.preferredGender)} alt="gender" style={{ width: '5%', height: 'auto', marginTop: '-1%' ,marginRight:'10px' }} />
                                            <div className="age-group">
                                                    {activity.ageGroup && activity.ageGroup.length > 0 ? (
                                                        <span className="age-text">{calculateAgeRange(activity.ageGroup[0].ageStart, activity.ageGroup[0].ageEnd)}</span>
                                                    ) : (
                                                        <span className="age-text">Unavailable</span>
                                                    )}
                                                </div>
                                                <img src={calendar} alt='calendar' style={{ width: '5%', height: 'auto', marginTop: '-2%'}} />
                                                <div className="day-selector">
                                                    {allDays.map((day) => (
                                                        <span key={day} className={`day ${activity.days.includes(day) ? 'active' : ''}`}>
                                                            {day}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className='pdesc'>
                                                <p>{activity.description || 'No description available'}</p>
                                            </div>
                                        </div>
                                        <div className='gap-after' style={{ height: '3px' }}></div>
                                        <div className="additional-info" style={{ display: 'flex', flexDirection: 'column', position: 'relative', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' }}>
                                            <div className="pinfo-image" style={{ marginLeft: '0px' }}>
                                                {providers[activity.providerId] && providers[activity.providerId].logo ? (
                                                    <img src={`data:image/jpeg;base64,${providers[activity.providerId].logo}`} alt="Provider" />
                                                ) : (
                                                    <img src={placeholderLogo} alt="Placeholder Provider" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
      {/* Activity Actions Section */}
      {/* <div className="activity-actionss">
                                    <div className='activity-buttons'>
                                        <button
                                            className="book-now"
                                            style={{ backgroundColor: '#5EA858' }}
                                            onClick={() => {
                                                const provider = providers[activity.providerId];
                                                const providerName = provider ? provider.firstName : 'Unknown Provider';
                                                sendMessage(activity.name, providerName);
                                            }}
                                        >
                                            <i className="fa-brands fa-whatsapp"></i>
                                            <span style={{ marginLeft: '5px', fontWeight: 'bold' }}>Book Now</span>
                                        </button>

                                        <button className="share" style={{ backgroundColor: '#3880C4' }} onClick={() => handleShare(activity.name)}>
                                            <i className="fa-solid fa-share"></i>
                                            <span style={{ marginLeft: '5px', fontWeight: 'bold' }}>Share</span>
                                        </button>
                                        <button className="save" style={{ backgroundColor: '#3880C4' }} onClick={() => addToWishlist(activity)}>
                                            <i className="fa-regular fa-bookmark"></i>
                                            <span style={{ marginLeft: '5px', fontWeight: 'bold' }}>Save</span>
                                        </button>
                                    </div>
                                    <div className='more-btn'>
                                        <button className="more">See more from this provider</button>
                                    </div>
                                </div>
                            </div>
                        ))
                ) : (
                    <p>No promoted activities available at the moment.</p>
                )} */}

      {/* </div> */}

      {/* --------cards starts ----------- */}

      <div className="activity-bottom">
        {/* card 1 */}

        <div className="card-container">
          {loading ? (
            <div className="loader-container">
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          ) : (
            <div className="card-container-top">
              {courses.length > 0 ? (
                [
                  ...courses
                    .filter((course) => course.promoted) // Get promoted courses
                    .filter((course) => {
                      // Step 2: Check if selectedDate is between course.startDate and course.endDate
                      if (searchInitiated && selectedDate) {
                        const startDate = new Date(course.startDate);
                        const endDate = new Date(course.endDate);
                        const selected = new Date(selectedDate);
                        return selected >= startDate && selected <= endDate;
                      }
                      return true; // If no search has been initiated, return all courses
                    })
                    .filter((course) => {
                      // Only filter by location if a search has been initiated
                      if (searchInitiated && selectedLocation) {
                        return course.location.some(
                          (loc) => loc.city === selectedLocation
                        );
                      }
                      return true; // If no search has been initiated, return all courses
                    })
                    .filter((course) => {
                      // Only filter by age group if a search has been initiated
                      if (searchInitiated) {
                        const ageRange =
                          course.ageGroup && course.ageGroup.length > 0
                            ? calculateAgeRange(
                                course.ageGroup[0].ageStart,
                                course.ageGroup[0].ageEnd
                              )
                            : "Unavailable";
                        return isAgeGroupMatch(ageRange, selectedDob); // Filter based on age group
                      }
                      return true; // If no search has been initiated, return all courses
                    }),
                  ...courses
                    .filter((course) => !course.promoted) // Get non-promoted courses
                    .filter((course) => {
                      if (searchInitiated && selectedDate) {
                        const startDate = new Date(course.startDate);
                        const endDate = new Date(course.endDate);
                        const selected = new Date(selectedDate);
                        return selected >= startDate && selected <= endDate;
                      }
                      return true;
                    })
                    .filter((course) => {
                      if (searchInitiated && selectedLocation) {
                        return course.location.some(
                          (loc) => loc.city === selectedLocation
                        );
                      }
                      return true;
                    })
                    .filter((course) => {
                      if (searchInitiated) {
                        const ageRange =
                          course.ageGroup && course.ageGroup.length > 0
                            ? calculateAgeRange(
                                course.ageGroup[0].ageStart,
                                course.ageGroup[0].ageEnd
                              )
                            : "Unavailable";
                        return isAgeGroupMatch(ageRange, selectedDob);
                      }
                      return true;
                    }),
                ].map((course) => (
                  <div className="activity-card cards" key={course._id}>
                    <div className="activity-image">
                      {/* Display image if available */}
                      {course.images && course.images.length > 0 ? (
                        <img src={course.images[0]} alt="Course Image" />
                      ) : (
                        <img src={football} alt="Placeholder" />
                      )}
                      {course.promoted && (
                        <div className="promoted-overlay">
                          <div className="promoted-label">Promoted</div>
                        </div>
                      )}
                    </div>
                    <div className="activity-details">
                      <div className="activity-card-in">
                        <div className="info-with-img">
                          <div className="descp">
                            <div className="card-details-container">
                              <h3>{course.name}</h3>

                              <div className="act-location">
                                {/* <i className="fa-solid fa-location-dot"></i> */}
                                <div
                                  style={{ display: "flex", marginLeft: "5px" }}
                                >
                                  {/* Display location if available */}
                                  {course.location &&
                                  course.location.length > 0 ? (
                                    course.location.map((loc, index) => (
                                      <div
                                        key={index}
                                        className="activity-location"
                                      >
                                        <p style={{ marginRight: "8px" }}>
                                          <i
                                            className="fa-solid fa-location-dot"
                                            style={{ marginRight: "5px" }}
                                          ></i>
                                          {loc.address}
                                        </p>
                                      </div>
                                    ))
                                  ) : (
                                    <p>No locations available</p>
                                  )}
                                </div>
                              </div>
                              <span
                                style={{ color: "#5EA858", fontWeight: "bold" }}
                              >
                                QAR.{" "}
                                {`${course.feeAmount} (${formatFeeType(
                                  course.feeType
                                )})`}
                              </span>
                              <div className="info-row">
                                {/* Display age range if applicable */}
                                <div className="card-age-container">
                                  <img
                                    src={getGenderImage(course.preferredGender)}
                                    alt="gender"
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
                                </div>
                                <div className="card-week-container">
                                  <img src={calendar} alt="calendar" />
                                  <div className="day-selector">
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
                              </div>
                              {/* Flex container for description and logo image */}
                              <div className="description-logo-container">
                                <p className="activity-description">
                                  {course.description ||
                                    "No description available"}
                                </p>
                              </div>
                            </div>
                            <div className="additional-info">
                              <div className="info-image">
                                {/* Display additional info image if available */}
                                {providers[course.providerId] &&
                                providers[course.providerId].logo ? (
                                  <img
                                    src={providers[course.providerId].logo}
                                    alt="Provider"
                                  />
                                ) : (
                                  <img
                                    src={placeholderLogo}
                                    alt="Placeholder Provider"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                          <div
                            className="gap-after"
                            style={{ height: "3px" }}
                          ></div>
                        </div>
                      </div>

                      {/* Chevron dropdown for smaller screens only
                        <div className="chevron-dropdown" onClick={() => setIsExpanded(!isExpanded)}>
                            {isExpanded ? 'See Less' : 'See More'}
                            <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                        </div> */}

                      {/* Activity Actions Section */}
                      <div
                        className={`activity-actions ${
                          isExpanded ? "visible" : "hidden"
                        }`}
                      >
                        <div className="activity-buttons">
                          {/* <button
                            className="book-now"
                            style={{ backgroundColor: "#5EA858" }}
                            onClick={async () => {
                              try {
                                await fetch(
                                  "https://www.kidgage.com/api/leads/track",
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                  }
                                );
                              } catch (error) {
                                console.error(
                                  "Failed to update lead count:",
                                  error
                                );
                              }

                              // Continue to send the message on WhatsApp
                              const provider = providers[course.providerId];
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
                              style={{ marginLeft: "5px", fontWeight: "bold" }}
                            >
                              Book Now
                            </span>
                          </button> */}

                          <button
                            className="share"
                            style={{ backgroundColor: "#3880C4" }}
                            onClick={() => handleShare(course.name, course._id)}
                          >
                            <i className="fa-solid fa-share"></i>
                            <span
                              style={{ marginLeft: "5px", fontWeight: "bold" }}
                            >
                              {" "}
                              Share
                            </span>
                          </button>
                          <button
                            className="save"
                            style={{ backgroundColor: "#3880C4" }}
                            onClick={() => handleClick(course._id)}
                          >
                            <span
                              style={{ marginLeft: "5px", fontWeight: "bold" }}
                            >
                              {" "}
                              View more
                            </span>
                          </button>
                        </div>
                        <div className="more-btn">
                          <button
                            className="more"
                            onClick={() => handleNavigate(course.providerId)}
                          >
                            See more from this provider
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: "center" }}>
                  No courses available for this category.
                </p>
              )}

              {searchInitiated && (
                <>
                  {courses
                    .filter((course) => {
                      if (selectedDate) {
                        const startDate = new Date(course.startDate);
                        const endDate = new Date(course.endDate);
                        const selected = new Date(selectedDate);
                        return selected >= startDate && selected <= endDate;
                      }
                      return true;
                    })
                    .filter((course) => {
                      if (selectedLocation) {
                        return course.location.some(
                          (loc) => loc.city === selectedLocation
                        );
                      }
                      return true;
                    })
                    .filter((course) => {
                      const ageRange =
                        course.ageGroup && course.ageGroup.length > 0
                          ? calculateAgeRange(
                              course.ageGroup[0].ageStart,
                              course.ageGroup[0].ageEnd
                            )
                          : "Unavailable";
                      return isAgeGroupMatch(ageRange, selectedDob); // Filter based on age group
                    }).length === 0 && (
                    <p>
                      There are no courses available under the selections made.
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* cards ends */}

        {/* banner section starts*/}
        {courses.length > 0 && (
          <div className="banner-container">
            {loading ? (
              <div className="secloader-container">
                <div className="secloader"></div>
              </div>
            ) : (
              <>
                {isSmallScreen ? (
                  <>
                    {getCurrentMobileImage() && (
                      <div
                        className="card single-mobile-space"
                        onClick={() =>
                          handleClick(getCurrentMobileImage().bookingLink)
                        }
                      >
                        <img
                          src={getCurrentMobileImage().imageUrl}
                          alt="Mobile Ad"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {getCurrentDesktopImage() && (
                      <div
                        className="card bcard1"
                        onClick={() =>
                          handleClick(getCurrentDesktopImage().bookingLink)
                        }
                      >
                        <img
                          src={getCurrentDesktopImage().imageUrl}
                          alt="Desktop Banner"
                        />
                      </div>
                    )}
                  </>
                )}
                {desktopBanners.length === 0 && mobileBanners.length === 0 && (
                  <p>No advertisements found.</p>
                )}
              </>
            )}
          </div>
        )}
        {/* banner section ends */}
      </div>

      <div className="gapss"></div>
      {courses.length === 0 && <div className="no-courses-gap"></div>}

      {/* Footer Section */}
      <Footer />
    </>
  );
};

export default Activities;
