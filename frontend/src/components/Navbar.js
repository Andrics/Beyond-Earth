import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaRocket, FaUserAstronaut } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#f093fb" />
          </linearGradient>
        </defs>
      </svg>
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="nav-logo">
            <span className="logo-icon">
              <FaRocket style={{ fill: 'url(#logoGradient)' }} />
            </span>
            <span>Beyond Earth</span>
          </Link>
          
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/activities">Activities</Link>
            <Link to="/contact">Contact Us</Link>
            
            {user ? (
              <>
                <Link to="/booking">Book Trip</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/subscription">Subscription</Link>
                {user.subscription?.isActive && (
                  <Link to="/premium-content">Premium</Link>
                )}
                <span className="nav-user">
                  <FaUserAstronaut style={{ marginRight: '6px' }} />
                  {user.name}
                </span>
                <button onClick={handleLogout} className="btn btn-outline">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">
                  <button className="btn btn-primary">Sign Up</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

