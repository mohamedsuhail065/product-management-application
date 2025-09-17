import React from "react";
import styles from "./styles/WishlistDrawer.module.css";
import { IoIosHeartEmpty } from "react-icons/io";

const API_URL = "http://localhost:5000";

const WishlistDrawer = ({ isOpen, onClose, wishlist, onRemove }) => (
  <div className={`${styles.drawer} ${isOpen ? styles.open : ""}`}>
    <div className={styles.header}>
      <IoIosHeartEmpty size={26} className={styles.heartIcon} />
      <span className={styles.title}>Items</span>
      <button className={styles.closeBtn} onClick={onClose}>
        &gt;
      </button>
    </div>
    <div className={styles.body}>
      {wishlist.length === 0 ? (
        <p style={{ padding: 16, color: "#888" }}>No items in wishlist</p>
      ) : (
        wishlist.map((product) => (
          <div key={product._id} className={styles.item}>
            <img
              src={
                product.images?.[0]
                  ? `${API_URL}/${product.images[0].url.replace(/\\/g, "/")}`
                  : "https://via.placeholder.com/80x60?text=No+Image"
              }
              alt={product.title}
              className={styles.productImg}
            />
            <div className={styles.details}>
              <div className={styles.pTitle}>{product.title}</div>
              <div className={styles.price}>${product.variants?.[0]?.price || "-"}</div>
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={styles.star}>&#9734;</span>
                ))}
              </div>
            </div>
            <button
              className={styles.removeBtn}
              title="Remove from wishlist"
              onClick={() => onRemove(product._id)}
            >
              &times;
            </button>
          </div>
        ))
      )}
    </div>
  </div>
);

export default WishlistDrawer;
