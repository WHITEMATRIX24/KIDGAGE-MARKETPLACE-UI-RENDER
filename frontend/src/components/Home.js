import React from 'react';
import Header from './Header';
import HeroBanner from './HeroBanner';
import IntroSearch from './IntroSearch';
import TopActivities from './TopActivities';
import BlogSection from './BlogSection';
import TopProviders from './TopProviders';
import UpcomingEvents from './UpcomingEvents';
import Footer from './Footer';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <Header />
      <HeroBanner />
      {/* <IntroSearch /> */}
      <TopActivities />
      <BlogSection />
      <TopProviders />
      {/* <UpcomingEvents /> */}
      <Footer />
    </div>
  );
};

export default Home;
