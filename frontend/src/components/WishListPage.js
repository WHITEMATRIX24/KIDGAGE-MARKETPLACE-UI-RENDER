import React, { useState, useEffect } from 'react';
import './UpcomingEvents.css';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import heart from './assets/images/heart.png';
import placeholderImage from './assets/images/placeholder.jpg';

const WishlistPage = () => {
  const [wishlistEvents, setWishlistEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(null);
  const navigate = useNavigate();

  // Fetch wishlist items from localStorage
  useEffect(() => {
    const fetchWishlistEvents = () => {
      try {
        setLoading(true);
        const storedWishlist = localStorage.getItem('wishlistEvents');
        const wishlist = storedWishlist ? JSON.parse(storedWishlist) : [];
        setWishlistEvents(wishlist);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching wishlist events:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchWishlistEvents();
  }, []);

  const getEventStatus = (startDateString, endDateString) => {
    const today = new Date();
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    if (today >= startDate && today <= endDate) {
      return 'Live';
    } else if (today < startDate) {
      return 'Upcoming';
    } else {
      return 'Past';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid Date';
    return date.toLocaleDateString('en-GB'); // Format as dd-mm-yy
  };

  const bookNow = (event) => {
    navigate('/event-details', { state: { event } });
  };

  const getImageSource = (imageBase64) => {
    if (imageBase64) {
      return `data:image/jpeg;base64,${imageBase64}`;
    }
    return null;
  };

  // Remove item from localStorage wishlist
  const removeFromWishlist = (eventId) => {
    try {
      const updatedWishlist = wishlistEvents.filter(event => event._id !== eventId);
      localStorage.setItem('wishlistEvents', JSON.stringify(updatedWishlist));
      setWishlistEvents(updatedWishlist);
      setShowPopup('removed'); // Show popup on success
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };
  const calculateAgeRange = (startDate, endDate) => {
    const today = new Date();

    // Convert ISO strings to Date objects
    let start = new Date(startDate);
    let end = new Date(endDate);

    // Check if both dates are valid
    if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
        return 'unavailable';
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

  // Categorize events into Activities and Event Posters
  const categorizedEvents = wishlistEvents.reduce((acc, event) => {
    if (event.feeAmount) {
      acc.activities.push(event);
    } else {
      acc.eventPosters.push(event);
    }
    return acc;
  }, { activities: [], eventPosters: [] });
  const formatFeeType = (feeType) => {
    return feeType
        .split('_') // Split by underscore
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
        .join(' '); // Join them with a space
};
const handleClick = (courseId) => {
  navigate(`/activity-info/${courseId}`, { state: { id: courseId } });
};
  return (
    <div className="upcoming-events">
      {showPopup && (
        <div className="msg-popup">
          <p>{showPopup === 'removed' ? 'Removed from Wishlist!' : 'Added to Wishlist!'}</p>
        </div>
      )}
      <div className="wishlist-events-heading">
        <img src={heart} alt="wishlist-heart" />
        <h2> My Wishlist</h2>
      </div>

      {loading && <div className="loading">Loading wishlist...</div>}
      {error && <div className="error">Error: {error}</div>}
      {!loading && !error && (
        <>
          {/* Activities Section */}
          {categorizedEvents.activities.length > 0 && (
            <div style={{marginTop:'20px'}}>
              <h3>Saved Activities</h3>
              <div className="events-grid" >
                {categorizedEvents.activities.map(event => {
                const imageUrl = event.images && event.images.length > 0 
                ? `data:image/png;base64,${event.images[0]}` 
                : placeholderImage;
              
                const status = getEventStatus(event.startDate, event.endDate);
                  return (
                    <div key={event._id} className="event-card">
                      <img src={imageUrl} alt={event.name} />
                      <p style={{color:'#383',fontWeight:'bold'}}> QAR. {`${event.feeAmount} (${formatFeeType(event.feeType)})`}
                      </p>
                      <h3>{event.name}</h3>
                      <h4 className='event-description'>{event.description}</h4>
                      {/* <h4>{formatDate(event.startDate)} - {formatDate(event.endDate)}</h4> */}
                      {/* <a href={event.location}>View Location</a> */}
                      <div style={{textAlign:'left'}}>
                        {event.ageGroup && event.ageGroup.length > 0 ? (
                        <span style={{color:'#f37',fontWeight:'bold'}} className="age-text">Age: {calculateAgeRange(event.ageGroup[0].ageStart, event.ageGroup[0].ageEnd)}</span>
                        ) : (
                        <span style={{color:'#f37',fontWeight:'bold'}} className="age-text">Age: Unavailable</span>
                        )}
                        </div>
                      <button id="book-now" onClick={() => handleClick(event._id)}><i className="fas fa-arrow-right"></i>BOOK NOW</button>
                      <button id="wishlist" onClick={() => removeFromWishlist(event._id)}>
                        <i className="fa-solid fa-heart-crack"></i>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Event Posters Section */}
          {categorizedEvents.eventPosters.length > 0 && (
            <div style={{marginTop:'20px'}}>
              <h3>Saved Events</h3>
              <div className="events-grid" >
                {categorizedEvents.eventPosters.map(event => {
                  const imageUrl = getImageSource(event.image);
                  const status = getEventStatus(event.startDate, event.endDate);
                  return (
                    <div key={event._id} className="event-card">
                      <img src={imageUrl} alt={event.name} />
                      <p className={status === 'Upcoming' ? 'upcoming' : ''}>{status}</p>
                      <h3>{event.name}</h3>
                      <h4 className='event-description'>{event.description}</h4>
                      <h4>{formatDate(event.startDate)} - {formatDate(event.endDate)}</h4>
                      <a href={event.location}>View Location</a>

                      <button id="book-now" onClick={() => bookNow(event)}><i className="fas fa-arrow-right"></i>BOOK NOW</button>
                      <button id="wishlist" onClick={() => removeFromWishlist(event._id)}>
                        <i className="fa-solid fa-heart-crack"></i>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* No Events Message */}
          {categorizedEvents.activities.length === 0 && categorizedEvents.eventPosters.length === 0 && (
            <div className="no-events">No events in your wishlist.</div>
          )}
        </>
      )}
      <button className="floating-btn wishlist-btn" onClick={() => navigate('/')}>
        <i className="fa-solid fa-arrow-left"></i>
      </button>
    </div>
  );
};

export default WishlistPage;
