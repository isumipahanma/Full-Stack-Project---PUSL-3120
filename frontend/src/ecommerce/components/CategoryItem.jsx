import React from "react";
import styles from "./CategoryItem.module.css";

export const CategoryItem = ({ title, icon, onClick, isActive }) => {
  return (
    <div className={styles.categoryItem} onClick={onClick}>
      <div className={`${styles.categoryIcon} ${isActive ? styles.active : ''}`}>{icon}</div>
      <div className={styles.categoryTitle}>{title}</div>
    </div>
  );
};




