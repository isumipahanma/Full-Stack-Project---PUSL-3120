import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CiShoppingCart, CiSearch } from "react-icons/ci";
import styles from "../HomePage.module.css";

const Header = ({
  isMenuOpen,
  setIsMenuOpen,
  searchQuery,
  handleSearchChange,
  showSuggestions,
  filteredSuggestions,
  handleSuggestionClick,
  handleLoginClick,
  handleLoginClick2,
  handleCartClick,
  cartItems,
  menuRef,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check login status from localStorage or any other method
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);
  }, []);

  const handleProfileClick = () => {
    navigate("/profile"); // Navigate to the profile page
  };

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false); // Update the state to reflect the logged-out status
    navigate("/"); // Redirect to home page or login page after logout
  };

  return (
    <header className={styles.header}>
      {/* Logo */}
      <div className={styles.logo} onClick={() => navigate("/")}>Clothy</div>

      {/* Hamburger Menu Icon */}
      <div
        className={styles.hamburgerMenu}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </div>

      {/* Navigation Menu */}
      <form className={styles.searchForm} role="search">
        <label htmlFor="searchInput" className={styles.visuallyHidden}>
          Search Product or Brand
        </label>
        <div className={styles.searchInputContainer}>
          <CiSearch className={styles.searchIcon} size={20} />
          <input
            id="searchInput"
            type="search"
            className={styles.searchInput}
            placeholder="Search Product or Brand here ...."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {showSuggestions && searchQuery && (
            <ul className={styles.suggestionsDropdown}>
              {filteredSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className={styles.suggestionItem}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>

      {/* Auth Buttons */}
      <div className={`${styles.authButtons} ${isMenuOpen ? styles.show : ""}`}>
        {isLoggedIn ? (
          <>
            {/* User Button */}
            <button className={styles.authButton} onClick={handleProfileClick}>
              Profile
            </button>
            {/* Logout Button */}
            {/* <button className={styles.authButton} onClick={handleLogout}>
              Logout
            </button> */}
          </>
        ) : (
          <>
            <button className={styles.authButton} onClick={handleLoginClick2}>
              Sign Up
            </button>
            <button className={styles.authButton} onClick={handleLoginClick}>
              Login
            </button>
          </>
        )}
      </div>

      {/* Cart Icon */}
      <div
        className={`${styles.cartContainer} ${isMenuOpen ? styles.show : ""}`}
      >
        <CiShoppingCart size={20} color="#333" onClick={handleCartClick} />
        {cartItems.length > 0 && (
          <span className={styles.cartCount}>
            {cartItems.reduce((total, item) => total + item.quantity, 0)}
          </span>
        )}
      </div>
    </header>
  );
};

export default Header;
