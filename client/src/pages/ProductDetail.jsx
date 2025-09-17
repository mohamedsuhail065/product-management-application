import React, { useEffect, useState } from "react";
import styles from "./styles/ProductDetails.module.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import Modal from "../components/Modal";

const ProductDetails = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [productOpen, setProductOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubcategories] = useState([]);
  const [productTitle, setProductTitle] = useState("");
  const [variants, setVariants] = useState([{ ram: "", price: "", qty: 1 }]);
  const [productCategory, setProductCategory] = useState("");
  const [productSubCategory, setProductSubCategory] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const userId = JSON.parse(localStorage.getItem("user"))?._id;

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/product/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error(error);
        setProduct(null);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/categories`);
        setCategories(res.data);
      } catch (error) {
        console.error(error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!productCategory) {
      setSubcategories([]);
      return;
    }
    const fetchSubCategories = async () => {
      try {
        const res = await axios.get(
          `${apiUrl}/api/categories/subcategory/${productCategory}`
        );
        setSubcategories(res.data);
      } catch (error) {
        setSubcategories([]);
        console.error(error);
      }
    };
    fetchSubCategories();
  }, [productCategory]);

  const toggleWishlist = async (productId) => {
    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.patch(
        `${apiUrl}/api/product/${productId}/wishlist`,
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

  const openProductModal = () => {
    if (!product) return;
    setProductTitle(product.title || "");
    setProductDescription(product.description || "");
    setProductCategory(product.category || "");
    setProductSubCategory(product.subcategory || "");
    setVariants(product.variants || [{ ram: "", price: "", qty: 1 }]);
    setImagePreviews(
      product.images
        ? product.images.map((img) =>
            img.url.startsWith("http")
              ? img.url
              : `${apiUrl}/${img.url.replace(/\\/g, "/")}`
          )
        : []
    );
    setProductImages([]);
    setProductOpen(true);
  };

  const addVariant = () =>
    setVariants([...variants, { ram: "", price: "", qty: 1 }]);

  const updateVariant = (idx, key, value) => {
    setVariants(
      variants.map((v, i) => (i === idx ? { ...v, [key]: value } : v))
    );
  };

  const removeVariant = (idx) =>
    setVariants(variants.filter((_, i) => i !== idx));

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProductImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", productTitle);
    formData.append("description", productDescription);
    formData.append("category", productCategory);
    formData.append("subcategory", productSubCategory);
    variants.forEach((v, idx) =>
      formData.append(`variants[${idx}]`, JSON.stringify(v))
    );
    productImages.forEach((img) => formData.append("images", img));
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${apiUrl}/api/product/${product._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProduct(response.data);
      setProductOpen(false);
    } catch (error) {
      console.error("Error saving product:", error);
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
      : `${apiUrl}/${img.url.replace(/\\/g, "/")}`;

  const inputStyle = {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.breadcrumbs}>
        <span onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
          Home
        </span>{" "}
        &gt; <span>Product details</span>
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
            <button className={styles.editBtn} onClick={openProductModal}>
              Edit product
            </button>
            <Modal isOpen={productOpen} onClose={() => setProductOpen(false)}>
              <h2
                style={{
                  marginBottom: "10px",
                  textAlign: "center",
                  fontWeight: 600,
                }}
              >
                Edit Product
              </h2>
              <form
                onSubmit={handleProductSubmit}
                encType="multipart/form-data"
                style={{ minWidth: "320px" }}
              >
                <label style={{ fontWeight: 500 }}>Title :</label>
                <input
                  type="text"
                  placeholder="Product name"
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  style={inputStyle}
                  autoFocus
                />
                <label style={{ fontWeight: 500, marginTop: 8 }}>
                  Variants :
                </label>
                {variants.map((variant, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginBottom: 6,
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="RAM"
                      value={variant.ram}
                      onChange={(e) =>
                        updateVariant(idx, "ram", e.target.value)
                      }
                      style={{ ...inputStyle, width: 80 }}
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Price"
                      value={variant.price}
                      onChange={(e) =>
                        updateVariant(idx, "price", e.target.value)
                      }
                      style={{ ...inputStyle, width: 90 }}
                    />
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={variant.qty}
                      onChange={(e) =>
                        updateVariant(idx, "qty", e.target.value)
                      }
                      style={{ ...inputStyle, width: 60 }}
                    />
                    {variants.length > 1 && (
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => removeVariant(idx)}
                        style={{
                          background: "#eee",
                          border: "none",
                          borderRadius: 3,
                          cursor: "pointer",
                        }}
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addVariant}
                  style={{
                    margin: "3px 0 16px 0",
                    background: "#242424",
                    color: "white",
                    padding: "3px 12px",
                    borderRadius: 6,
                    border: "none",
                    fontSize: "0.97rem",
                    cursor: "pointer",
                  }}
                >
                  Add variants
                </button>
                <br />

                <label style={{ fontWeight: 500 }}>Category :</label>
                <select
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  style={{ ...inputStyle, marginBottom: 12 }}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <label style={{ fontWeight: 500 }}>Sub category :</label>
                <select
                  value={productSubCategory}
                  onChange={(e) => setProductSubCategory(e.target.value)}
                  style={{ ...inputStyle, marginBottom: 12 }}
                >
                  <option value="">Select Subcategory</option>
                  {subCategories.map((sc) => (
                    <option key={sc._id} value={sc._id}>
                      {sc.name}
                    </option>
                  ))}
                </select>

                <label style={{ fontWeight: 500 }}>Description :</label>
                <input
                  type="text"
                  placeholder="Product description"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  style={inputStyle}
                />

                <label style={{ fontWeight: 500, marginTop: 10 }}>
                  Upload image :
                </label>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  multiple
                  onChange={handleImageChange}
                  style={{ marginBottom: 12 }}
                />
                <div style={{ display: "flex", gap: "12px", margin: "8px 0" }}>
                  {imagePreviews.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      height={48}
                      alt="img-preview"
                      style={{
                        borderRadius: 4,
                        border: "1.5px solid #e3e3e3",
                        width: 64,
                        height: 48,
                        objectFit: "cover",
                      }}
                    />
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 15,
                    marginTop: 12,
                  }}
                >
                  <button
                    type="submit"
                    style={{
                      padding: "8px 25px",
                      backgroundColor: "#e8b03e",
                      color: "white",
                      borderRadius: 8,
                      fontWeight: 600,
                      letterSpacing: "1px",
                      border: "none",
                    }}
                  >
                    SAVE
                  </button>
                  <button
                    type="button"
                    style={{
                      padding: "8px 22px",
                      backgroundColor: "#ccc",
                      borderRadius: 8,
                      opacity: 0.7,
                      color: "#222",
                      border: "none",
                    }}
                    onClick={() => setProductOpen(false)}
                  >
                    DISCARD
                  </button>
                </div>
              </form>
            </Modal>
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
