import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Cart.module.css";
import { FaShoppingBag, FaTrash, FaArrowLeft } from "react-icons/fa";

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showPopup, setShowPopup] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardExpiryMonth: "",
    cardExpiryYear: "",
    cardCvc: "",
  });

  const initialCartItems =
    JSON.parse(localStorage.getItem("cartItems")) ||
    location.state?.cartItems ||
    [];

  const [cartItems, setCartItems] = useState(initialCartItems);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleQuantityChange = (id, operation) => {
    const updatedItems = cartItems
      .map((item) => {
        if (item.id === id) {
          const newQuantity =
            operation === "increase" ? item.quantity + 1 : item.quantity - 1;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      })
      .filter(Boolean);

    setCartItems(updatedItems);
  };

  const handleRemoveAllItems = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  const handlePaymentDetailsChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleCheckout = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please log in to proceed with checkout.");
      return;
    }

    setShowPopup(true);
  };

  const handlePaymentSubmit = async () => {
    if (!cartItems.length) {
      alert("No items in the cart!");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("User not logged in!");
      return;
    }

    const purchaseId = Date.now().toString();

    const purchaseData = cartItems.map((item) => ({
      purchaseId,
      userid: user.id,
      id: item.id,
      title: item.name,
      date: new Date().toISOString(),
      price: item.price * item.quantity,
      quantity: item.quantity,
      size: item.size,
    }));

    console.log("Purchase Data:", purchaseData);

    try {
      const response = await fetch(
        "http://localhost:3001/api/addpurchasedata",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(purchaseData),
        }
      );

      const result = await response.json();
      console.log("Server Response:", result);

      if (result.success) {
        alert("Payment successful and data saved!");
        setShowPopup(false);
        setCartItems([]);
        localStorage.removeItem("cartItems");
      } else {
        alert(result.error || "Saving data failed! Please try again.");
      }
    } catch (error) {
      console.error("Error during saving data:", error);
      alert("An error occurred while saving data.");
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className={styles.cart}>
        <div className={styles.cartHeader}>
          <button className={styles.backToShoppingButton} onClick={() => navigate("/")}>
            <FaArrowLeft className={styles.backIcon} />
            Back to Shopping
          </button>
          <h1 className={styles.title}>
            <FaShoppingBag className={styles.cartIcon} />
            Shopping Cart
          </h1>
        </div>
        <div className={styles.emptyCart}>
          <div className={styles.emptyCartIcon}>
            <FaShoppingBag size={60} />
          </div>
          <h2>Your cart is empty!</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <button className={styles.continueShoppingButton} onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const postage = 20.0;
  const total = subtotal + postage;

  return (
    <div className={styles.cart}>
      <div className={styles.cartHeader}>
        <button className={styles.backToShoppingButton} onClick={() => navigate("/")}>
          <FaArrowLeft className={styles.backIcon} />
          Back to Shopping
        </button>
        <h1 className={styles.title}>
          <FaShoppingBag className={styles.cartIcon} />
          Shopping Cart ({cartItems.length})
        </h1>
        {cartItems.length > 0 && (
          <button className={styles.clearCartButton} onClick={handleRemoveAllItems}>
            <FaTrash className={styles.trashIcon} />
            Clear Cart
          </button>
        )}
      </div>

      <div className={styles.cartContent}>
        <div className={styles.cartItems}>
          {cartItems.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <div className={styles.itemImage}>
                <img src={item.image} alt={item.name} />
              </div>
              <div className={styles.itemDetails}>
                <h3 className={styles.itemName}>{item.name}</h3>
                <p className={styles.itemPrice}>Rs: {item.price.toFixed(2)}</p>
                <p className={styles.itemSize}>Size: {item.size}</p>
                <div className={styles.quantityControl}>
                  <button
                    className={styles.quantityButton}
                    onClick={() => handleQuantityChange(item.id, "decrease")}
                  >
                    -
                  </button>
                  <span className={styles.quantityDisplay}>
                    {item.quantity}
                  </span>
                  <button
                    className={styles.quantityButton}
                    onClick={() => handleQuantityChange(item.id, "increase")}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.orderSummary}>
          <div className={styles.summaryHeader}>
            <h3 className={styles.summaryTitle}>
              <FaShoppingBag className={styles.summaryIcon} />
              Order Summary
            </h3>
          </div>
          
          <div className={styles.summaryItems}>
            <div className={styles.summaryItem}>
              <span>Subtotal ({cartItems.length} items)</span>
              <span className={styles.summaryValue}>Rs: {subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.summaryItem}>
              <span>Shipping</span>
              <span className={styles.summaryValue}>Free</span>
            </div>
            <div className={styles.summaryItem}>
              <span>Postage</span>
              <span className={styles.summaryValue}>Rs: {postage.toFixed(2)}</span>
            </div>
          </div>
          
          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span className={styles.totalValue}>Rs: {total.toFixed(2)}</span>
          </div>
          
          <button className={styles.checkoutButton} onClick={handleCheckout}>
            <FaShoppingBag className={styles.checkoutIcon} />
            Proceed to Checkout
          </button>
        </div>
      </div>

      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h3>Enter Card Details</h3>
            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number"
              value={paymentDetails.cardNumber}
              onChange={handlePaymentDetailsChange}
              className={styles.inputField}
            />
            <div className={styles.expiryCvcContainer}>
              <select
                name="cardExpiryMonth"
                value={paymentDetails.cardExpiryMonth}
                onChange={handlePaymentDetailsChange}
                className={styles.inputField}
              >
                <option value="">MM</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={(i + 1).toString().padStart(2, "0")}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <select
                name="cardExpiryYear"
                value={paymentDetails.cardExpiryYear}
                onChange={handlePaymentDetailsChange}
                className={styles.inputField}
              >
                <option value="">YYYY</option>
                {Array.from({ length: 10 }, (_, i) => (
                  <option
                    key={i}
                    value={(new Date().getFullYear() + i).toString()}
                  >
                    {new Date().getFullYear() + i}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="cardCvc"
                placeholder="CVC"
                value={paymentDetails.cardCvc}
                onChange={handlePaymentDetailsChange}
                className={styles.inputField}
              />
            </div>
            <button className={styles.payButton} onClick={handlePaymentSubmit}>
              Pay Now
            </button>
            <button
              className={styles.closeButton}
              onClick={() => setShowPopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
