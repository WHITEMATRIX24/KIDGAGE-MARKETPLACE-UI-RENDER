import React, { useState, useRef, useEffect } from "react";
import Calendar2 from "react-calendar";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import "./SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [activeOption, setActiveOption] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDobDropdown, setShowDobDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDob, setSelectedDob] = useState("Age");
  const [selectedLocation, setSelectedLocation] = useState("Location");
  const [selectedActivity, setSelectedActivity] = useState("Activity");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showActivityDropdown, setShowActivityDropdown] = useState(false);
  const [missingSelection, setMissingSelection] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const searchBarRef = useRef(null);
  const dropdownRef = useRef(true);
  const activityDropdownRef = useRef(null);

  const locations = [
    "Doha",
    "Al Wakrah",
    "Al Khor",
    "Al Rayyan",
    "Al Shamal",
    "Al Daayen",
    "Al Shahaniya",
    "Umm Salal",
    "Dukhan",
    "Mesaieed",
  ];
  const ageRanges = [
    "0-2 years",
    "3-5 years",
    "6-8 years",
    "9-12 years",
    "13-17 years",
  ];
  const [courseTypes, setCourseTypes] = useState([]);
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
        setShowDobDropdown(false);
        setShowDropdown(false);
        setShowActivityDropdown(false);
        setMissingSelection(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (showDropdown) {
        handleDropdownKeyNavigation(event, locations, handleLocationSelect);
      } else if (showActivityDropdown) {
        handleDropdownKeyNavigation(event, courseTypes, handleActivitySelect);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showDropdown, showActivityDropdown, highlightedIndex]);

  const handleDropdownKeyNavigation = (event, options, handleSelect) => {
    if (event.key === "ArrowDown") {
      setHighlightedIndex((prevIndex) =>
        Math.min(prevIndex + 1, options.length - 1)
      );
    } else if (event.key === "ArrowUp") {
      setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (event.key === "Enter" && highlightedIndex !== -1) {
      handleSelect(options[highlightedIndex]);
      setHighlightedIndex(-1);
    }
  };
  

  const handleOptionClick = (option) => {    
    setHighlightedIndex(-1);
    if (option === "location") {
      setShowDropdown(!showDropdown);
      setShowActivityDropdown(false);
      setShowCalendar(false);
      setShowDobDropdown(false);
    } else if (option === "activity") {
      setShowActivityDropdown(!showActivityDropdown);
      setShowDropdown(false);
      setShowCalendar(false);
      setShowDobDropdown(false);
    } else if (option === "age") {
      setShowDobDropdown(!showDobDropdown);
      setShowDropdown(false);
      setShowActivityDropdown(false);
      setShowCalendar(false);
    } else if (option === "date") {
      setShowCalendar(!showCalendar);
      setShowDropdown(false);
      setShowActivityDropdown(false);
      setShowDobDropdown(false);
    } else {
      setActiveOption(option === activeOption ? null : option);
      setShowDropdown(false);
      setShowActivityDropdown(false);
      setShowCalendar(false);
      setShowDobDropdown(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowCalendar(false); // Close the calendar after selecting a date
  };

  const handleDobSelect = (ageRange) => {
    setSelectedDob(ageRange);
    setShowDobDropdown(false);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setShowDropdown(false);
  };

  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
    setShowActivityDropdown(false);
  };

  const handleSearchClick = () => {
    if (
      selectedLocation !== "Location" &&
      selectedDob !== "Age" &&
      selectedDate &&
      selectedActivity !== "Activity"
    ) {
      console.log("Searching with:", {
        selectedLocation,
        selectedDob,
        selectedDate,
        selectedActivity,
      });
      setMissingSelection(false); // Reset if all selections are valid
      onSearch({
        selectedLocation,
        selectedDob,
        selectedDate,
        selectedActivity,
      });

      // Refresh the page after a successful search
    } else {
      setMissingSelection(true);
    }
  };

  const getLabelClassName = (selectedValue, defaultValue) => {
    return selectedValue === defaultValue ? "missing-selection-label" : "";
  };
  

  return (
    <header className="header" ref={searchBarRef}>
      <div className="content">
        <div className="sbar">
          <div className="items">
            <div className="item" onClick={() => handleOptionClick("location")}>
              <label
                className={getLabelClassName(selectedLocation, "Location")}
                style={{
                  color:
                    missingSelection && selectedLocation === "Location"
                      ? "red"
                      : "#3880C4",
                  marginLeft: "10px",
                }}
              >
                {selectedLocation}
                <FontAwesomeIcon icon={faChevronDown} />
              </label>
              <span
                className="sub-label"
                style={{
                  color:
                    missingSelection && selectedLocation === "Location"
                      ? "red"
                      : "inherit",
                  marginLeft: "10px",
                }}
              >
                Search activities near you
              </span>
              {showDropdown && (
                <div className="dropdown-menu-new" ref={dropdownRef}>
                  {locations.map((location, index) => (
                    <div
                      key={location}
                      className={
                        highlightedIndex === index ? "highlighted" : ""
                      }
                      onClick={() => handleLocationSelect(location)}
                    >
                      {location}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="dividers" />
            <div className="item" onClick={() => handleOptionClick("age")}>
              <label
                className={getLabelClassName(selectedDob, "Age")}
                style={{
                  color:
                    missingSelection && selectedDob === "Age"
                      ? "red"
                      : "#3880C4",
                  marginLeft: "10px",
                }}
              >
                {selectedDob}
                <FontAwesomeIcon icon={faChevronDown} />
              </label>
              <span
                className="sub-label"
                style={{
                  color:
                    missingSelection && selectedDob === "Age"
                      ? "red"
                      : "inherit",
                  marginLeft: "10px",
                }}
              >
                Select age range
              </span>
              {showDobDropdown && (
                <div className="dropdown-menu-new">
                  {ageRanges.map((ageRange, index) => (
                    <div
                      key={ageRange}
                      className={
                        highlightedIndex === index ? "highlighted" : ""
                      }
                      onClick={() => handleDobSelect(ageRange)}
                    >
                      {ageRange}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="dividers" />
            <div className="item" onClick={() => handleOptionClick("date")}>
              <label
                className={getLabelClassName(selectedDate, null)}
                style={{
                  color: missingSelection && !selectedDate ? "red" : "#3880C4",
                  marginLeft: "10px",
                }}
              >
                {selectedDate
                  ? selectedDate.toLocaleDateString("en-GB")
                  : "Date"}
                <FontAwesomeIcon icon={faChevronDown} />
              </label>
              <span
                className="sub-label"
                style={{
                  color: missingSelection && !selectedDate ? "red" : "inherit",
                  marginLeft: "10px",
                }}
              >
                All dates and days
              </span>
              {showCalendar && (
                <div className="calendar-dropdowna">
                  <Calendar2
                    onChange={handleDateChange}
                    value={selectedDate || new Date()}
                    minDetail="month"
                    className="custom-cal"
                  />
                </div>
              )}
            </div>
            <div className="dividers" />
            <div className="item" onClick={() => handleOptionClick("activity")}>
              <label
                className={getLabelClassName(selectedActivity, "Activity")}
                style={{
                  color:
                    missingSelection && selectedActivity === "Activity"
                      ? "red"
                      : "#3880C4",
                  marginLeft: "10px",
                }}
              >
                {selectedActivity}
                <FontAwesomeIcon icon={faChevronDown} />
              </label>
              <span
                className="sub-label"
                style={{
                  color:
                    missingSelection && selectedActivity === "Activity"
                      ? "red"
                      : "inherit",
                  marginLeft: "10px",
                }}
              >
                All activities
              </span>
              {showActivityDropdown && (
                <div className="dropdown-menu-new" ref={activityDropdownRef}>
                  {courseTypes.map((activity, index) => (
                    <div
                      key={activity}
                      className={
                        highlightedIndex === index ? "highlighted" : ""
                      }
                      onClick={() => handleActivitySelect(activity)}
                      style={{
                        color:
                          missingSelection && !selectedDate ? "red" : "inherit",
                      }}
                    >
                      {activity}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="dividers" />
            <button className="sbutton" onClick={handleSearchClick}>
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SearchBar;
