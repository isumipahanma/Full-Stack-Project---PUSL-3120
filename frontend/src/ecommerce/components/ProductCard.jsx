import React from "react";
import styles from "./ProductCard.module.css";
import { TiStar } from "react-icons/ti";

export const ProductCard = ({ imageUrl, rating, title, price, onClick }) => {
  // State to track whether the heart is clicked (favorited)

  return (
    <div className={styles.productCard} onClick={onClick}>
      {/* Image Section */}
      <div
        className={styles.imageContainer}
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className={styles.ratingContainer}>
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <TiStar
                key={index}
                size={16}
                color={index < rating ? "#ffa41b" : "#ccc"}
              />
            ))}
        </div>
      </div>

      {/* Product Information Section */}
      <div className={styles.productInfo}>
        <div className={styles.productTitle}>{title}</div>
        <div className={styles.productPrice}>RS: {price}</div>
      </div>
    </div>
  );
};
