import React from "react";
import Axios from "axios";
import styles from "./AdminDashboard.module.css";

export function ProductList({ products, onDelete, onUpdate }) {
  const handleDeleteClick = async (id) => {
    try {
      // Send delete request to the backend
      const response = await Axios.post(
        "http://localhost:3001/api/deleteproducts",
        { id }
      );
      console.log(response.data.message);

      // Update the parent component's product list state
      onDelete(id);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <section aria-label="Product list" className={styles.productList}>
      <div className={styles.div7}>
        <div className={styles.div8}>
          <div>ID</div>
          <div>Name</div>
          <div>Category</div>
        </div>
        <div>Action</div>
      </div>
      {products.map((product) => (
        <div key={product.id} className={styles.div9}>
          <div className={styles.div10}>
            <div>{product.id}</div>
            <div>{product.title}</div>
            <div>{product.category}</div>
          </div>
          <div className={styles.div11}>
            <button
              className={styles.update}
              aria-label={`Update ${product.title}`}
              onClick={() => onUpdate(product.id)}
            >
              Update
            </button>
            <button
              className={styles.delete}
              aria-label={`Delete ${product.title}`}
              onClick={() => handleDeleteClick(product.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}
