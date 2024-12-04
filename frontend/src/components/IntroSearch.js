import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./IntroSearch.css";
import Calendar2 from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";

const IntroSearch = () => {
  const [activeOption, setActiveOption] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDobCalendar, setShowDobCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDob, setSelectedDob] = useState("Age");
  // const [selectedLocation, setSelectedLocation] = useState("Doha");
  const [selectedActivity, setSelectedActivity] = useState("Activity");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isActivityDropdownVisible, setIsActivityDropdownVisible] = useState(
    false
  );
  const [missingSelection, setMissingSelection] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSubDropdown, setShowSubDropdown] = useState(null); // To control sub-dropdown visibility

  const searchBarRef = useRef(null);
  const navigate = useNavigate();

  // const locations = [
  //   "Doha",
  //   "Al Wakrah",
  //   "Al Khor",
  //   "Al Rayyan",
  //   "Al Shamal",
  //   "Al Shahaniya",
  //   "Umm Salal",
  //   "Dukhan",
  //   "Mesaieed",
  // ];

  const ageRanges = [
    "0-2 years",
    "3-5 years",
    "6-8 years",
    "9-12 years",
    "13-17 years",
  ];
  const [activities, setCourseTypes] = useState([]);
  useEffect(() => {
    const fetchCourseTypes = async () => {
      try {
        const response = await axios.get(
          "https://www.kidgage.com/api/course-category/categories"
        );
        // Assuming the response is an array of objects and each object has a 'name' property for the category
        const categoryNames = response.data.map((category) => category.name);
        setCourseTypes(categoryNames);
      } catch (error) {
        console.error("Error fetching course types", error);
      }
    };

    fetchCourseTypes();
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target)
      ) {
        setActiveOption(null);
        setShowCalendar(false);
        setShowDobCalendar(false);
        setIsDropdownVisible(false);
        setIsActivityDropdownVisible(false);
        setShowMobileMenu(false);
        setShowSubDropdown(null); // Close sub-dropdown on outside click
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option) => {
    if (option === "location") {
      setIsDropdownVisible(!isDropdownVisible);
      setIsActivityDropdownVisible(false);
      setShowSubDropdown(null); // Close sub-dropdown when location dropdown is toggled
    } else if (option === "activity") {
      setIsActivityDropdownVisible(!isActivityDropdownVisible);
      setIsDropdownVisible(false);
      setShowSubDropdown(null); // Close sub-dropdown when activity dropdown is toggled
    } else if (option === "age") {
      setShowDobCalendar(!showDobCalendar);
      setShowCalendar(false);
    } else if (option === "date") {
      setShowCalendar(!showCalendar);
      setShowDobCalendar(false);
    } else {
      setActiveOption(option === activeOption ? null : option);
      setIsDropdownVisible(false);
      setIsActivityDropdownVisible(false);
      setShowCalendar(false);
      setShowDobCalendar(false);
      setShowSubDropdown(null); // Close sub-dropdown when another option is selected
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const handleDobChange = (ageRange) => {
    setSelectedDob(ageRange);
    setShowDobCalendar(false);
  };

  // const handleLocationSelect = (location) => {
  //   setSelectedLocation(location);
  //   setShowSubDropdown(null); // Close sub-dropdown when location is selected
  //   setIsDropdownVisible(false);
  // };

  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
    setShowSubDropdown(null); // Close sub-dropdown when activity is selected
    setIsActivityDropdownVisible(false);
  };

  const handleSearchClick = () => {
    if (
      selectedDob !== "Age" &&
      selectedDate &&
      selectedActivity !== "Activity"
    ) {
      navigate("/activityinfo", {
        state: {
          dob: selectedDob,
          ageRange: selectedDate
            ? selectedDate.toLocaleDateString("en-GB")
            : "",
          category: selectedActivity,
        },
      });
    } else {
      setMissingSelection(true);
    }
  };

  const handleMobileMenuToggle = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const toggleSubDropdown = (dropdown) => {
    setShowSubDropdown(showSubDropdown === dropdown ? null : dropdown);
  };

  return (
    <div className="intro-search">
      <div className="intro-content">
        <h1 className="intro-title">Find an activity your child will love</h1>
        <p className="intro-subtitle">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
          massa lacus,
        </p>
      </div>
      <div className="search-container" ref={searchBarRef}>
        {/* Mobile View */}
        {window.innerWidth < 660 && (
          <div className="intro-search-bar">
            <button onClick={handleMobileMenuToggle}>
              Search for Activities,Locations
            </button>

            <i className="fas fa-chevron-down"></i>
            {showMobileMenu && (
              <div className="mobile-dropdown">
                <ul>
                  {/* <li onClick={() => toggleSubDropdown("location")}>
                    {selectedLocation}
                    <i className="fas fa-chevron-down"></i>
                    {showSubDropdown === "location" && (
                      <ul className="mobile-sub-dropdown">
                        {locations.map((loc, index) => (
                          <li
                            key={index}
                            onClick={() => handleLocationSelect(loc)}
                          >
                            {loc}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li> */}
                  <li onClick={() => handleOptionClick("age")}>
                    {selectedDob}
                    <i className="fas fa-chevron-down"></i>
                    {showDobCalendar && (
                      <ul className="mobile-sub-dropdown">
                        {ageRanges.map((ageRange, index) => (
                          <li
                            key={index}
                            onClick={() => handleDobChange(ageRange)}
                          >
                            {ageRange}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                  <li onClick={() => handleOptionClick("date")}>
                    {selectedDate
                      ? selectedDate.toLocaleDateString("en-GB")
                      : "Date"}
                  </li>
                  <li onClick={() => toggleSubDropdown("activity")}>
                    {selectedActivity}
                    <i className="fas fa-chevron-down"></i>
                    {showSubDropdown === "activity" && (
                      <ul className="mobile-sub-dropdown">
                        {activities.map((activity, index) => (
                          <li
                            key={index}
                            onClick={() => handleActivitySelect(activity)}
                          >
                            {activity}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                </ul>
              </div>
            )}
            <button className="intro-search-button" onClick={handleSearchClick}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="intro-search-icon"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        )}

        {/* Desktop View */}
        {window.innerWidth >= 660 && (
          <div className="intro-search-bar">
            <div className="search-options">
              {/* <div
                className={`search1-option ${activeOption === "location" ? "active" : ""}`}
                onClick={() => handleOptionClick("location")}
              >
                <div className="ssss">

                  <p
                    style={{
                      color: missingSelection && !selectedLocation ? "red" : "#2e2d2d8a",
                    }}
                  >
                    {selectedLocation}
                    <i className="fas fa-chevron-down"></i>
                  </p>
                </div>
                {isDropdownVisible && (
                  <div className="dropdown">
                    <ul>
                      {locations.map((loc, index) => (
                        <li
                          key={index}
                          onClick={() => handleLocationSelect(loc)}
                          className="dropdown-item"
                        >
                          {loc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <span className="separator-log">|</span> */}

              <div className="search4-option">
                <div className="sss">
                  <p
                    className={` ${activeOption === "age" ? "active" : ""}`}
                    onClick={() => handleOptionClick("age")}
                    style={{
                      color:
                        missingSelection && selectedDob === "Age"
                          ? "red"
                          : "#2e2d2d8a",
                    }}
                  >
                    {selectedDob}
                  </p>
                </div>
                {showDobCalendar && (
                  <div className="dropdown">
                    <ul>
                      {ageRanges.map((ageRange, index) => (
                        <li
                          key={ageRange}
                          onClick={() => handleDobChange(ageRange)}
                          className="dropdown-item"
                        >
                          {ageRange}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <span className="separator-log">|</span>

              <h4
                className={`search1-options ${
                  activeOption === "date" ? "active" : ""
                }`}
                onClick={() => handleOptionClick("date")}
                style={{
                  color:
                    missingSelection && !selectedDate ? "red" : "#2e2d2d8a",
                }}
              >
                {selectedDate
                  ? selectedDate.toLocaleDateString("en-GB")
                  : "Date"}
              </h4>

              <span className="separator-log">|</span>

              <div
                className={`search4-option ${
                  activeOption === "activity" ? "active" : ""
                }`}
                onClick={() => handleOptionClick("activity")}
                style={{
                  color:
                    missingSelection && selectedActivity === "Activity"
                      ? "red"
                      : "#2e2d2d8a",
                }}
              >
                <div className="sss">
                  <p>{selectedActivity}</p>
                </div>
                {isActivityDropdownVisible && (
                  <div className="dropdown">
                    <ul>
                      {activities.map((activity, index) => (
                        <li
                          key={index}
                          onClick={() => handleActivitySelect(activity)}
                          className="dropdown-item"
                        >
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <button className="intro-search-button" onClick={handleSearchClick}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="intro-search-icon"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        )}

        {showCalendar && (
          <div className="calendar-dropdown2">
            <Calendar2
              onChange={handleDateChange}
              value={selectedDate || new Date()}
              minDetail="month"
              className="custom-cal"
            />
          </div>
        )}
        {missingSelection && (
          <p className="missing-selection">Please select all options.</p>
        )}
      </div>
    </div>
  );
};

export default IntroSearch;
