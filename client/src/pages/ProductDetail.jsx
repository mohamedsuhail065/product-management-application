import React, { useEffect, useState } from "react";
import styles from "./styles/ProductDetails.module.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";

const API_URL = "http://localhost:5000";

const ProductDetails = () => {
    const navigate=useNavigate()
  const params = useParams();
  const id = params.id;
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const userId = JSON.parse(localStorage.getItem("user"))?._id;
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/product/${id}`
        );
        setProduct(response.data);
      } catch (error) {
        console.log(error);
        setProduct([]);
      }
    };
    fetchProduct();
  }, []);

  const toggleWishlist = async (productId) => {
    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.patch(
        `http://localhost:5000/api/product/${productId}/wishlist`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProduct((prev) =>
        prev && prev._id === productId
          ? { ...prev, wishlist: data.wishlist }
          : prev
      );
    } catch (err) {
      console.error("Wishlist toggle failed", err);
    }
  };


  if (!product) return <div>Loading...</div>;

  const variantStock =
    product.variants && product.variants.length > 0
      ? product.variants[selectedVariant].qty
      : 0;

  const imgSrc = (img) =>
    img.url?.startsWith("http")
      ? img.url
      : `${API_URL}/${img.url.replace(/\\/g, "/")}`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.breadcrumbs}>
        <span onClick={()=>navigate('/home')} style={{cursor:"pointer"}}>Home</span> &gt; <span>Product details</span>
      </div>
      <div className={styles.content}>
        {/* Left: image(s) */}
        <div className={styles.left}>
          <div className={styles.imgMain}>
            <img
              src={imgSrc(product?.images[selectedImage])}
              alt={product.title}
            />
          </div>
          <div className={styles.imgThumbs}>
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={imgSrc(img)}
                alt="thumb"
                className={selectedImage === idx ? styles.selected : ""}
                onClick={() => setSelectedImage(idx)}
              />
            ))}
          </div>
        </div>
        {/* Right: details */}
        <div className={styles.right}>
          <h2 className={styles.title}>{product.title}</h2>
          <div className={styles.price}>${product.variants[0]?.price}</div>
          <div className={styles.row}>
            <span className={styles.label}>Availability:</span>
            {variantStock > 0 ? (
              <span className={styles.inStock}>✔ In stock</span>
            ) : (
              <span className={styles.outStock}>Out of stock</span>
            )}
          </div>
          <div className={styles.stockMsg}>
            Hurry up! only {variantStock} product left in stock!
          </div>
          <hr style={{ marginTop: 10, marginBottom: 10 }} />
          {/* RAM options */}
          <div className={styles.row}>
            <span className={styles.label}>Ram:</span>
            {product.variants.map((v, idx) => (
              <button
                key={idx}
                className={`${styles.ramBtn} ${
                  selectedVariant === idx ? styles.selectedBtn : ""
                }`}
                onClick={() => setSelectedVariant(idx)}
              >
                {v.ram}
              </button>
            ))}
          </div>
          {/* Quantity */}
          <div className={styles.row}>
            <span className={styles.label}>Quantity :</span>
            <button
              className={styles.qtyBtn}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </button>
            <span className={styles.qty}>{quantity}</span>
            <button
              className={styles.qtyBtn}
              onClick={() => setQuantity(quantity + 1)}
              disabled={quantity >= variantStock}
            >
              +
            </button>
          </div>
          <div className={styles.actions}>
            <button className={styles.editBtn}>Edit product</button>
            <button className={styles.buyBtn}>Buy it now</button>
            <button
              className={styles.favoriteBtn}
              title="Add to wishlist"
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product._id);
              }}
            >
              {product.wishlist?.includes(userId) ? (
                <IoIosHeart size={18} color="red" />
              ) : (
                <IoIosHeartEmpty size={18} color="black" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
