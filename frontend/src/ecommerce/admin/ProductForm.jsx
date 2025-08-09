import React, { useState, useEffect } from "react";
import Axios from "axios";
import styles from "./AdminDashboard.module.css";

export function ProductForm({ onSubmit, currentProduct }) {
  const [formData, setFormData] = useState({
    id: currentProduct?.id || "",
    title: currentProduct?.title || "",
    price: currentProduct?.price || "",
    rating: currentProduct?.rating || "",
    category: currentProduct?.category || "",
    imageUrl: currentProduct?.imageUrl || "",
  });

  useEffect(() => {
    // Update formData when currentProduct changes
    if (currentProduct) {
      setFormData({
        id: currentProduct.id,
        title: currentProduct.title,
        price: currentProduct.price,
        rating: currentProduct.rating,
        category: currentProduct.category,
        imageUrl: currentProduct.imageUrl,
      });
    }
  }, [currentProduct]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form data being sent:", formData); // Debug log

    try {
      const response = currentProduct
        ? await Axios.post(
            "http://localhost:3001/api/updateproducts", // Assuming this is your update endpoint
            formData
          )
        : await Axios.post(
            "http://localhost:3001/api/createproducts", // Create endpoint
            formData
          );
      console.log("Product submitted successfully:", response.data);
      onSubmit(response.data);

      // Reset form after submission
      setFormData({
        id: "",
        title: "",
        price: "",
        rating: "",
        category: "",
        imageUrl: "",
      });
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  return (
    <form className={styles.div} onSubmit={handleSubmit}>
      <h2 className={styles.enterProductIteams}>Enter Product Items</h2>
      <div className={styles.div2}>
        <div className={styles.div3}>
          <div className={styles.column}>
            <div className={styles.div4}>
              <label htmlFor="id" className={styles.name}>
                ID:
              </label>
              <label htmlFor="title" className={styles.name}>
                Name:
              </label>
              <label htmlFor="price" className={styles.price}>
                Price:
              </label>
              <label htmlFor="rating" className={styles.rating}>
                Rating:
              </label>
              <label htmlFor="category" className={styles.category}>
                Category:
              </label>
              <label htmlFor="imageUrl" className={styles.imageUrl}>
                ImgUrl:
              </label>
            </div>
          </div>
          <div className={styles.column2}>
            <div className={styles.div5}>
              <input
                id="id"
                name="id"
                type="number"
                className={styles.typeHeare2}
                value={formData.id}
                onChange={handleChange}
                aria-label="Product ID"
                required
              />
              <input
                id="title"
                name="title"
                className={styles.typeHeare2}
                value={formData.title}
                onChange={handleChange}
                aria-label="Product title"
                required
              />
              <input
                id="price"
                name="price"
                type="number"
                className={styles.typeHeare3}
                value={formData.price}
                onChange={handleChange}
                aria-label="Product price"
                required
              />
              <input
                id="rating"
                name="rating"
                type="number"
                min="0"
                max="5"
                className={styles.typeHeare4}
                value={formData.rating}
                onChange={handleChange}
                aria-label="Product rating"
                required
              />
              {/* Category dropdown */}
              <select
                id="category"
                name="category"
                className={styles.typeHeare5}
                value={formData.category}
                onChange={handleChange}
                aria-label="Product category"
                required
              >
                <option value="">Select a category</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
                <option value="Accessories">Accessories</option>
                <option value="Essentials">Essentials</option>
              </select>
              <input
                id="imageUrl"
                name="imageUrl"
                className={styles.typeHeare6}
                value={formData.imageUrl}
                onChange={handleChange}
                aria-label="Product imageUrl"
                required
              />
            </div>
          </div>
        </div>
      </div>
      <button type="submit" className={styles.submit}>
        {currentProduct ? "Update" : "Submit"}
      </button>
    </form>
  );
}
