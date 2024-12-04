import React, { useState, useEffect } from "react";
import "./UpcomingEvents.css";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import chatbotImage from "./assets/images/chatbot.png"; // Import the chatbot image

const months = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

const UpcomingEvents = () => {
  const currentMonthIndex = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState(months[currentMonthIndex]);
  const [viewAll, setViewAll] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://www.kidgage.com/api/posters");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setEventsData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 3000);
      return () => clearTimeout(timer); // Cleanup timer on component unmount
    }
  }, [showPopup]);

  const isEventInSelectedMonth = (startDateString, endDateString) => {
    if (!startDateString && !endDateString) return false;

    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    if (isNaN(startDate) && isNaN(endDate)) return false;

    const eventStartMonth = startDate.getMonth();
    const eventEndMonth = endDate.getMonth();
    const eventYear = startDate.getFullYear();

    const monthIndex = months.indexOf(selectedMonth.toUpperCase());

    return (
      eventStartMonth <= monthIndex &&
      eventEndMonth >= monthIndex &&
      eventYear === new Date().getFullYear()
    );
  };

  const getEventStatus = (startDateString, endDateString) => {
    const today = new Date();
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    if (today >= startDate && today <= endDate) {
      return "Live";
    } else if (today < startDate) {
      return "Upcoming";
    } else {
      return "Past";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";
    return date.toLocaleDateString("en-GB"); // Format as dd-mm-yy
  };

  const filteredEvents = eventsData.filter((event) =>
    isEventInSelectedMonth(event.startDate, event.endDate)
  );

  // Add event to wishlist and store it in local storage
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

  const bookNow = (event) => {
    navigate("/event-details", { state: { event } });
  };
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    setShowDropdown(false); // Hide the dropdown after selection
  };

  const viewWishlist = () => {
    navigate("/wishlist"); // Replace '/wishlist' with the path to your wishlist page
  };

  const viewCart = () => {
    navigate("/shops"); // Replace '/cart' with the path to your cart page
  };

  const getImageSource = (imageBase64) => {
    if (imageBase64) {
      return `data:image/jpeg;base64,${imageBase64}`;
    }
    return null;
  };

  return (
    <div className="upcoming-events">
      {showPopup && (
        <div className="msg-popup">
          <p>Added to Wishlist!</p>
        </div>
      )}
      <div className="upcoming-events-heading">
        <h2>
          Upcoming event in
          <div className="custom-dropdown-container">
            <div className="custom-dropdown" onClick={toggleDropdown}>
              <span className="dropdown-selected">{selectedMonth}</span>
              <i
                className={`fa-solid fa-caret-down event-drop-down ${
                  showDropdown ? "rotate" : ""
                }`}
              ></i>
            </div>
            {showDropdown && (
              <ul className="dropdown-list">
                {months.map((month) => (
                  <li
                    key={month}
                    onClick={() => handleMonthSelect(month)}
                    className="dropdown-item"
                  >
                    {month}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </h2>
      </div>

      {loading && (
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
      {error && <div className="error">Error: {error}</div>}
      {!loading && !error && (
        <>
          {filteredEvents.length > 0 ? (
            <>
              <div className="events-grid">
                {filteredEvents
                  .slice(0, viewAll ? filteredEvents.length : 5)
                  .map((event) => {
                    const imageUrl = getImageSource(event.image);
                    const status = getEventStatus(
                      event.startDate,
                      event.endDate
                    );
                    return (
                      <div key={event._id} className="event-card">
                        <img src={imageUrl} alt={event.name} />
                        <button
                          id="wishlist"
                          onClick={() => addToWishlist(event)}
                        >
                          <i className="fa-solid fa-heart-circle-plus"></i>
                        </button>
                        <p className={status === "Upcoming" ? "upcoming" : ""}>
                          {status}
                        </p>
                        <h3>{event.name}</h3>
                        <h4 className="event-description">
                          {event.description}
                        </h4>
                        <span className="date-h4">
                          {formatDate(event.startDate)} -{" "}
                          {formatDate(event.endDate)}
                        </span>
                        <a href={event.location}>VENUE</a>

                        <button id="book-now" onClick={() => bookNow(event)}>
                          <i className="fas fa-arrow-right"></i>BOOK NOW
                        </button>
                      </div>
                    );
                  })}
              </div>
              {filteredEvents.length > 5 && (
                <button
                  className="event-view-all"
                  onClick={() => setViewAll(!viewAll)}
                >
                  {viewAll ? "Hide" : "View All"}
                </button>
              )}
            </>
          ) : (
            <div className="no-events">
              No events available for the selected month.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UpcomingEvents;
