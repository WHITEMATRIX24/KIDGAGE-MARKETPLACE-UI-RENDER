import React, { useState } from 'react';
import CTypeSlider from './CTypeSlider';
import './TopActivities.css';

const TopActivities = () => {
  const [viewAll, setViewAll] = useState(false);

  const handleViewAll = () => {
    setViewAll(true);
  };

  const handleHideAll = () => {
    setViewAll(false);
  };

  return (
    <div className="top-activities">
      {!viewAll ? (
        <>
          <CTypeSlider />
          <button className='top-act-view' onClick={handleViewAll}>
            View All
          </button>
        </>
      ) : (
        <>
          <div className="list-container">
            {/* Render CTypeSlider items in a list format */}
            <CTypeSlider viewAll={viewAll} />
          </div>
          <button className='top-act-view hide-all' onClick={handleHideAll}>
            Hide All
          </button>
        </>
      )}
    </div>
  );
};

export default TopActivities;
