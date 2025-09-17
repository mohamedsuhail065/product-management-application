import React, { useEffect, useState } from "react";
import styles from "./styles/Sidebar.module.css";
import axios from "axios";

const Sidebar = ({onFilterChange}) => {
    const apiUrl = import.meta.env.VITE_API_URL;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
 useEffect(() => {
    onFilterChange(selectedCategory, selectedSubcategories);
  }, [selectedCategory, selectedSubcategories]);

 useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/categories`);
      setCategories(res.data);
      setLoading(false);
    } catch (error) {
      setCategories([]);
      setLoading(false);
      console.error("Error fetching categories:", error);
    }
  };
  fetchCategories();
}, []); 

useEffect(() => {
  if (!selectedCategory) {
    setSubcategories([]);
    return;
  }
  const fetchSubCategories = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/categories/subcategory/${selectedCategory}`);
      setSubcategories(res.data);
    } catch (error) {
      setSubcategories([]);       
      console.error("Error fetching subcategories:", error);
    }
  };
  fetchSubCategories();
}, [selectedCategory]); 


  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId === selectedCategory ? null : catId);
    setSelectedSubcategories([]);
  };

  const handleSubcategoryToggle = (subcatId) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcatId)
        ? prev.filter((id) => id !== subcatId)
        : [...prev, subcatId]
    );
  };

  if (loading) return <aside className={styles.sidebar}>Loading...</aside>;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>Categories</div>
      <ul className={styles.categoryList}>
        <li
          className={`${styles.categoryItem} ${
            !selectedCategory ? styles.active : ""
          }`}
          onClick={() => setSelectedCategory(null)}
        >
          All categories
        </li>
        {categories.map((cat) => (
          <li key={cat._id} className={styles.categoryGroup}>
            <div
              className={`${styles.categoryItem} ${
                selectedCategory === cat._id ? styles.active : ""
              }`}
              onClick={() => handleCategoryClick(cat._id)}
            >
              {cat.name}
            </div>
            {subcategories && subcategories.length > 0 && selectedCategory === cat._id && (
              <ul className={styles.subcategoryList}>
                {subcategories.map((subcat) => (
                  <li key={subcat._id} className={styles.subcategoryItem}>
                    <label className={styles.filterLabel}>
                      <input
                        type="checkbox"
                        checked={selectedSubcategories.includes(subcat._id)}
                        onChange={() => handleSubcategoryToggle(subcat._id)}
                      />
                      {subcat.name}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
