import React, { useState } from 'react';
import './Tabs.css';

const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(children[0].props.label);

  const onClickTab = tab => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="tab-listss">
        {children.map((child, index) => {
          const { label } = child.props;
          const key = `tab-${index}`; // Use a unique key for each tab
          return (
            <button
              key={key}
              className={`tabss ${activeTab === label ? 'activess' : ''}`}
              onClick={() => onClickTab(label)}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div className="tab-contentss">
        {children.map((child, index) => {
          if (child.props.label !== activeTab) return null;
          return <div key={`content-${index}`}>{child.props.children}</div>;
        })}
      </div>
    </div>
  );
};

export default Tabs;
