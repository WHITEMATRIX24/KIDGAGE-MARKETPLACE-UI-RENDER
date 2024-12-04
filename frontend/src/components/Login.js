import React from 'react';
import Tabs from './Tabs';
import { FaTimes, FaBuilding, FaUser } from 'react-icons/fa';
import Button from './Button';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = ({ closeMenu }) => {
  return (
    <div className="login-container">
      <FaTimes className="close-btn-minus" onClick={closeMenu} />
      {/* <Tabs> */}
      <div label={<div className="tab-label"><FaBuilding className="tab-icon" />Business</div>}>
      <div className="tab-label"><FaBuilding className="tab-icon" />Business</div>
          {/* <Link to="/business-signin"> */}
            <Button primary>Activities Manager</Button>
          {/* </Link> */}
          <Link to="/business-signup">
            <Button>Get Started</Button>
          </Link>
        </div>
        <div label={<div className="tab-label"><FaUser className="tab-icon" />Parent</div>}>
          {/* <Link to="/personal-signin">
            <Button primary>Log in to Kidgage</Button>
          </Link>
          <Link to="/personal-signup">
            <Button>Create an Account</Button>
          </Link> */}
        </div>

      {/* </Tabs> */}
    </div>
  );
};

export default Login;
