import React, { useState, useEffect } from 'react';
import './Shops.css';  // Import the updated CSS file
import th1 from './assets/images/thumbnail1.png';
import th2 from './assets/images/thumbnail2.png';
import th3 from './assets/images/thumbnail3.png';
import th4 from './assets/images/main-image.png';
import Footer from './Footer';
import Header from './Header';

const Shops = () => {
  const [selectedImage, setSelectedImage] = useState(th1);
  const [wishlist, setWishlist] = useState([]);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState('3 Months');
  const images = [th1, th2, th3, th4];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      setSelectedImage(images[(currentIndex + 1) % images.length]);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, images]);

  const handleWishlistToggle = () => {
    const product = {
      title: "Green Kid Crafts Subscription Box",
      image: selectedImage
    };
    if (isInWishlist) {
      setWishlist(wishlist.filter(item => item.title !== product.title));
    } else {
      setWishlist([...wishlist, product]);
    }
    setIsInWishlist(!isInWishlist);
    alert(isInWishlist ? 'Removed from Wishlist!' : 'Added to Wishlist!');
  };

  const handleNextImage = () => {
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const handlePrevImage = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const reviews = [
    {
      name: 'Jane Doe',
      date: 'September 10, 2024',
      text: 'My kids love these boxes! The projects are fun and educational, and we always look forward to the next one.',
    },
    {
      name: 'John Smith',
      date: 'August 20, 2024',
      text: 'Great quality and value for the price. Perfect for keeping my little ones entertained and learning!',
    },
  ];

  const handleSubscriptionChange = (event) => {
    setSelectedSubscription(event.target.value);
  };

  return (
    <div>
      {/* Header */}
      <Header />

      <div className='shops-top'>
        {/* Product Images */}
        <div className="image-container">
          {/* <button onClick={handlePrevImage} className="arrow-left">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button> */}

          <img className="main-image" src={selectedImage} alt="Product" />

          {/* <button onClick={handleNextImage} className="arrow-right">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button> */}

          <div className="thumbnail-container">
            {images.map((image, index) => (
              <img
                key={index}
                className={`thumbnail ${selectedImage === image ? 'active' : ''}`}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </div>
          </div>

          {/* Product Details */}
          <div className='shops-right'>
          <div className="details-container">
            <h1 className="product-title">Green Kid Crafts Subscription Box</h1>
            <p className="price">QAR. 24.95 per month</p>
            <p className="description">
              Green Kid Crafts is a monthly subscription box that fosters creativity and learning for kids through eco-friendly, hands-on science and art projects.
            </p>
          </div>

          <div className="buttons-options">
            {/* Subscription Options */}
          <div className="options-container">
            {['1 Month', '3 Months', '6 Months', '12 Months'].map((option) => (
              <div
                key={option}
                className={`option ${selectedSubscription === option ? 'selected' : ''}`}
                onClick={() => setSelectedSubscription(option)}
              >
                <input
                  type="radio"
                  name="subscription"
                  value={option}
                  checked={selectedSubscription === option}
                  onChange={handleSubscriptionChange}
                />
                <label>
                  <strong>{option}</strong> - QAR. {(option === '1 Month' ? '24.95' :
                    option === '3 Months' ? '69.85' :
                      option === '6 Months' ? '129.70' : '239.40')}
                </label>
              </div>
            ))}
          </div>
          
          {/* Buttons: Add to Cart, Give as Gift, Wishlist */}
          <div className="button-container">
            <button className="shbutton add-to-cart">Add to Cart</button>
            <button className="shbutton give-gift">Give as Gift</button>
            <button onClick={handleWishlistToggle} className={`shbutton wishlist ${isInWishlist ? 'active' : ''}`}>
              {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
          </div>
        </div>
        </div>

          
          <div className='content-section'>
      {/* Tabs: Overview, Reviews & Questions */}
      <div className="tabs-container">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`} 
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'reviews' ? 'active' : ''}`} 
          onClick={() => setActiveTab('reviews')}
        >
          Reviews & Questions
        </button>
      </div>

      {/* Conditionally render content based on active tab */}
      {activeTab === 'overview' ? (
        <div className="product-details">
          <h2>Product Details</h2>
          <p>
            Named "Best Kids Subscription Box" by the New York Times and USA Today—and featured in Wired, Redbook, Real Simple, and Good Housekeeping—our winning monthly science and craft box helps kids unplug, families connect, and provides hours of creative time! Founded by a scientist-mom, each box has been designed to inspire kids to explore their environment, learn problem-solving, teach leadership skills, and stay away from screens. Give the gift of creativity and learning all year long!
          </p>
          <ul>
            <li>Great mix of science experiments and art projects – with everything you need to complete up to 6 activities in every box</li>
            <li>Immediate shipping! Your first box ships right away, plus your order.</li>
            <li>Spend quality time while learning and practicing creative, developmental skills.</li>
            <li>Great gifts for kids; perfect for ages 3-10 and up!</li>
          </ul>
        </div>
      ) : (
        // Customer Reviews
        <div className="reviews-container">
          {reviews.map((review, index) => (
            <div key={index} className="review">
              <p className="reviewer-name">{review.name}</p>
              <p className="review-date">{review.date}</p>
              <p className="review-text">{review.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>



       



      {/* YouTube Video */}
      <div className="video-container">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/Z4R17TTg-wk?si=PAZNrUzGMwlraKma" 
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <Footer />
    </div>
  );
};

export default Shops;