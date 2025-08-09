import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";
import { ProductCard } from "./components/ProductCard";
import { CategoryItem } from "./components/CategoryItem";
import { Footer } from "./components/Footer";
import { FaMale, FaFemale, FaChild } from "react-icons/fa";
import { GiSunglasses, GiClothes } from "react-icons/gi";
import { BiSolidCategory } from "react-icons/bi";
import slide1 from "./components/image/banner-1.png";
import slide2 from "./components/image/banner-2.png";
import footerBanner from "./components/image/FooterBanner.png";
import PopupCard from "./components/PopupCard";
import Axios from "axios";
import Header from "./components/Header";

const sliderImages = [slide1, slide2];

// Product categories List
const categories = [
  { title: "Men", icon: <FaMale /> },
  { title: "Women", icon: <FaFemale /> },
  { title: "Kids", icon: <FaChild /> },
  { title: "Accessories", icon: <GiSunglasses /> },
  { title: "Essentials", icon: <GiClothes /> },
  { title: "All", icon: <BiSolidCategory /> },
];

export const HomePage = () => {
  const [cartItems, setCartItems] = useState([]); // Store cart items in state
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const [products, setProducts] = useState([]); // Product state to hold fetched data

  useEffect(() => {
    getProducts();
  }, []); // Fetch products on component mount

  // Fetch products from your API
  const getProducts = () => {
    Axios.get("http://localhost:3001/api/products")
      .then((response) => {
        setProducts(response.data?.response || []);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // State to track search suggestions
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [displayedProducts, setDisplayedProducts] = useState(8);
  const [allProductsLoaded, setAllProductsLoaded] = useState(false);

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to handle adding item to the cart
  const addToCart = (product, quantity, size) => {
    // Ensure the price is a string if it's a number
    const price =
      typeof product.price === "string"
        ? product.price
        : `RS: ${product.price.toFixed(2)}`;

    const newItem = {
      id: product.id,
      name: product.title,
      price: parseFloat(price.replace("RS:", "").trim()), // This will work since price is guaranteed to be a string
      quantity: quantity,
      size: size,
      image: product.imageUrl,
    };

    // Retrieve existing cart items from localStorage or initialize as empty array
    const existingCartItems =
      JSON.parse(localStorage.getItem("cartItems")) || [];

    // Check if the item with the same ID and size already exists in the cart
    const existingIndex = existingCartItems.findIndex(
      (item) => item.id === product.id && item.size === size
    );

    // Update the quantity
    if (existingIndex !== -1) {
      existingCartItems[existingIndex].quantity += quantity;
    } else {
      existingCartItems.push(newItem);
    }

    // Update the state and localStorage
    setCartItems(existingCartItems);
    localStorage.setItem("cartItems", JSON.stringify(existingCartItems));

    setIsOpen(false);
  };

  // Handler to open popup and set product data
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  // Pass cartItems to Cart page using React Router state
  const handleCartClick = () => {
    navigate("/cart", { state: { cartItems } });
  };

  // Navigate to the login page
  const handleLoginClick = () => {
    navigate("/login");
  };

  // Navigate to the Sign In page
  const handleLoginClick2 = () => {
    navigate("/signin");
  };

  // Load cart items from localStorage when the component mounts
  useEffect(() => {
    const savedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(savedCartItems);
  }, []);

  // Filter products based on selected category and search query
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    // Ensure product.title is defined before calling toLowerCase
    const matchesSearchQuery = product.title
      ? product.title.toLowerCase().includes(searchQuery.toLowerCase())
      : false;

    return matchesCategory && matchesSearchQuery;
  });

  // Handle search input change
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Show suggestions only if there is a search query
    if (query.length > 0) {
      setShowSuggestions(true);

      // Filter the product titles based on the search query
      const suggestions = products
        .filter((product) =>
          product.title.toLowerCase().includes(query.toLowerCase())
        )
        .map((product) => product.title);

      setFilteredSuggestions(suggestions);
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  const handleShowAllClick = () => {
    if (displayedProducts < filteredProducts.length) {
      setDisplayedProducts(filteredProducts.length);
      setAllProductsLoaded(true);
    }
  };

  // Function to handle pagination
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % sliderImages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.home}>
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        showSuggestions={showSuggestions}
        filteredSuggestions={filteredSuggestions}
        handleSuggestionClick={handleSuggestionClick}
        handleLoginClick={handleLoginClick}
        handleLoginClick2={handleLoginClick2}
        handleCartClick={handleCartClick}
        cartItems={cartItems}
        menuRef={menuRef}
      />
      {/* Hero Banner */}
      <div className={styles.heroBanner} role="banner">
        <div
          className={styles.slider}
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {sliderImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Slide ${index + 1}`}
              className={styles.slideImage}
            />
          ))}
        </div>
        <div className={styles.dots}>
          {sliderImages.map((_, index) => (
            <span
              key={index}
              className={`${styles.dot} ${
                currentSlide === index ? styles.activeDot : ""
              }`}
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className={styles.categories} aria-label="Product Categories">
        {categories.map((category, index) => (
          <CategoryItem
            key={index}
            title={category.title}
            icon={category.icon}
            onClick={() => setSelectedCategory(category.title)}
            isActive={selectedCategory === category.title}
          />
        ))}
      </section>

      {/* Product Grid */}
      <PopupCard
        isOpen={isOpen}
        product={selectedProduct}
        onClose={() => setIsOpen(false)}
        onAddToCart={addToCart}
      />

      {/* See more button */}
      <h1 className={styles.sectionTitle}>
        {selectedCategory === "All" ? "All Items" : selectedCategory}
      </h1>

      <section
        onClick={() => setIsOpen(true)}
        className={styles.productGrid}
        aria-label="Featured Products"
      >
        {filteredProducts.slice(0, displayedProducts).map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            onClick={() => handleProductClick(product)}
          />
        ))}
      </section>

      {filteredProducts.length > displayedProducts && (
        <button className={styles.seeAllButton} onClick={handleShowAllClick}>
          {allProductsLoaded ? "No More Products" : "Show All"}
        </button>
      )}

      {/* Footer */}
      <div className={styles.promotionBanner} role="banner">
        <img src={footerBanner} alt="Promotion Banner" />
      </div>

      <Footer />
    </div>
  );
};
