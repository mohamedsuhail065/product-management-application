import React, { useEffect, useState } from "react";
import styles from "./styles/ActionBar.module.css";
import axios from "axios";
import Modal from "./Modal";

const ActionBar = () => {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryOpen, setSubCategoryOpen] = useState(false);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [productOpen, setProductOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubcategories] = useState([]);
  const [productCategory, setProductCategory] = useState("");
  const inputStyle = {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  };

  const [productTitle, setProductTitle] = useState("");
  const [variants, setVariants] = useState([{ ram: "", price: "", qty: 1 }]);
  const [productSubCategory, setProductSubCategory] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;
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
    const response = await axios.post(`${apiUrl}/api/product`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log(response.data);
    setProductTitle("");
    setProductDescription("");
    setProductSubCategory("");
    setVariants([{ ram: "", price: "", qty: 1 }]);
    setProductImages([]);
    setImagePreviews([]);
    alert("Product added successfully");
    setProductOpen(false);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/categories`);
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
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
        console.error("Error fetching subcategories:", error);
      }
    };
    fetchSubCategories();
  }, [productCategory]);

  const openModal = () => setCategoryOpen(true);
  const closeModal = () => {
    setCategoryOpen(false);
    setCategoryName("");
  };
  const openSubCategoryModal = () => setSubCategoryOpen(true);
  const closeSubCategoryModal = () => {
    setSubCategoryOpen(false);
    setSubCategoryName("");
  };
  const openProductModal = () => setProductOpen(true);

  const handleCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    const response = await axios.post(`${apiUrl}/api/categories`, {
      name: categoryName,
    });
    console.log(response.data);
    alert("Category created successfully");
    closeModal();
  };
  const handleSubCategory = async (e) => {
    e.preventDefault();
    if (!subCategoryName.trim()) return;
    const response = await axios.post(`${apiUrl}/api/categories/subcategory`, {
      name: subCategoryName,
      categoryId: selectedCategory || categories[0]?._id,
    });
    console.log(response.data);
    alert("Subcategory created successfully");
    closeSubCategoryModal();
  };
  return (
    <div className={styles.actionBar}>
      <button className={styles.actionBtn} onClick={openModal}>
        Add category
      </button>
      <Modal isOpen={categoryOpen} onClose={closeModal}>
        <h2
          style={{ marginBottom: "10px", textAlign: "center", fontWeight: 600 }}
        >
          Add Category
        </h2>
        <form onSubmit={handleCategory}>
          <input
            type="text"
            placeholder="Category name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "1rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
            autoFocus
          />
          <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
            <button
              type="submit"
              style={{
                padding: "5px 12px",
                backgroundColor: "#e8b03e",
                color: "white",
                borderRadius: 8,
              }}
            >
              Add
            </button>
            <button
              type="button"
              style={{
                padding: "5px 14px",
                backgroundColor: "#ccc",
                borderRadius: 8,
                opacity: 0.7,
              }}
              onClick={closeModal}
            >
              Discard
            </button>
          </div>
        </form>
      </Modal>
      <button className={styles.actionBtn} onClick={openSubCategoryModal}>
        Add sub category
      </button>
      <Modal isOpen={subCategoryOpen} onClose={closeSubCategoryModal}>
        <h2
          style={{ marginBottom: "10px", textAlign: "center", fontWeight: 600 }}
        >
          Add Sub Category
        </h2>
        <form onSubmit={handleSubCategory}>
          <select
            value={
              selectedCategory || (categories[0] && categories[0]._id) || ""
            }
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Sub Category name"
            value={subCategoryName}
            onChange={(e) => setSubCategoryName(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "1rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
            autoFocus
          />
          <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
            <button
              type="submit"
              style={{
                padding: "5px 12px",
                backgroundColor: "#e8b03e",
                color: "white",
                borderRadius: 8,
              }}
            >
              Add
            </button>
            <button
              type="button"
              style={{
                padding: "5px 14px",
                backgroundColor: "#ccc",
                borderRadius: 8,
                opacity: 0.7,
              }}
              onClick={closeSubCategoryModal}
            >
              Discard
            </button>
          </div>
        </form>
      </Modal>
      <button className={styles.actionBtn} onClick={openProductModal}>
        Add product
      </button>
      <Modal isOpen={productOpen} onClose={() => setProductOpen(false)}>
        <h2
          style={{ marginBottom: "10px", textAlign: "center", fontWeight: 600 }}
        >
          Add Product
        </h2>
        <form
          onSubmit={handleProductSubmit}
          encType="multipart/form-data"
          style={{ minWidth: "320px" }}
        >
          {/* Title */}
          <label style={{ fontWeight: 500 }}>Title :</label>
          <input
            type="text"
            placeholder="Product name"
            value={productTitle}
            onChange={(e) => setProductTitle(e.target.value)}
            style={inputStyle}
            autoFocus
          />

          {/* Variants */}
          <label style={{ fontWeight: 500, marginTop: 8 }}>Variants :</label>
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
                onChange={(e) => updateVariant(idx, "ram", e.target.value)}
                style={{ ...inputStyle, width: 80 }}
              />
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Price"
                value={variant.price}
                onChange={(e) => updateVariant(idx, "price", e.target.value)}
                style={{ ...inputStyle, width: 90 }}
              />
              <input
                type="number"
                min="1"
                placeholder="Qty"
                value={variant.qty}
                onChange={(e) => updateVariant(idx, "qty", e.target.value)}
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
          {/*Category */}

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
          {/* Subcategory */}
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

          {/* Description */}
          <label style={{ fontWeight: 500 }}>Description :</label>
          <input
            type="text"
            placeholder="Product description"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            style={inputStyle}
          />

          {/* Upload image(s) */}
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
              ADD
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
    </div>
  );
};

export default ActionBar;
