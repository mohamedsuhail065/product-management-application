import React from "react";
import styles from "./styles/ProductGrid.module.css";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const ProductGrid = ({ products = [],userId, toggleWishlist }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
const handleWishlistClick = (e, id) => {
    e.stopPropagation();
    toggleWishlist(id);
  };

  const navigate = useNavigate();
  if (!products.length) {
    return <div className={styles.empty}>No products found.</div>;
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <div
          key={product._id}
          className={styles.card}
          onClick={() => navigate(`product/${product._id}`)}
        >
          <button
            className={styles.favoriteBtn}
            title="Add to wishlist"
            onClick={(e) => handleWishlistClick(e, product._id)}
          >
            {product.wishlist?.includes(userId) ? (
              <IoIosHeart size={18} color="red" />
            ) : (
              <IoIosHeartEmpty size={18} color="black" />
            )}
          </button>
          <div className={styles.imageWrapper}>
            <img
              src={
                product.images && product.images.length > 0
                  ? `${apiUrl}/${product.images[0].url.replace(
                      /\\/g,
                      "/"
                    )}`
                  : "https://via.placeholder.com/120x90?text=No+Image"
              }
              alt={product.title}
              className={styles.image}
            />
          </div>
          <div className={styles.details}>
            <div className={styles.title}>{product.title}</div>
            {product.variants?.length > 0 && (
              <div className={styles.price}>${product.variants[0].price}</div>
            )}
          </div>
          <div className={styles.stars}>
            {[...Array(5)].map((_, i) => (
              <span key={i} className={styles.star}>
                &#9734;
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
