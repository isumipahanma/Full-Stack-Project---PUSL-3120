import React, { useState, useEffect } from "react";
import "./PopupCard.css";

const PopupCard = ({ isOpen, product, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState("S");
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Update selectedSize and quantity when the size buttons are clicked
  useEffect(() => {
    if (isOpen) {
      setQuantity(1); // Reset quantity to 1 when the popup is opened
      setIsAddingToCart(false);
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const { imageUrl, title, price } = product;

  // Function to handle quantity change
  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1); // Decrease quantity, but not below 1
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    // Simulate a brief delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    onAddToCart(product, quantity, selectedSize); // Pass all product details to addToCart
    setIsAddingToCart(false);
    onClose(); // Close the popup after adding to cart
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    // Add a subtle animation feedback
    const button = document.querySelector(`[data-size="${size}"]`);
    if (button) {
      button.style.transform = 'scale(1.1)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 150);
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <div className="popup-content">
          <img className="popup-image" src={imageUrl} alt={title} />
          <div className="popup-details">
            <h2>{title}</h2>
            <p className="price">
              <span className="sale-price">Rs {price}</span>{" "}
              {/* <span className="original-price">{price}</span> */}
            </p>
            <div className="sizes">
              {["XS", "S", "M", "L", "XL", "XXL", "3XL"].map((size, index) => (
                <button
                  key={index}
                  data-size={size}
                  className={`size-button ${
                    size === selectedSize ? "active" : ""
                  }`}
                  onClick={() => handleSizeSelect(size)}
                  disabled={false} // You can add logic here to disable unavailable sizes
                >
                  {size}
                </button>
              ))}
            </div>
            <div className="quantity">
              <button 
                className="quantity-button" 
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="quantity-value">{quantity}</span>
              <button 
                className="quantity-button" 
                onClick={increaseQuantity}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button 
              onClick={handleAddToCart} 
              className="add-to-cart-button"
              disabled={isAddingToCart}
            >
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </button>
            <span className="Bottom-Text">See full details</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupCard;
