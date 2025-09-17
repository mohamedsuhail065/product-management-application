import { useEffect, useState } from "react";
import ActionBar from "../components/ActionBar";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import styles from "./styles/Home.module.css";
import ProductGrid from "../components/ProductGrid";
import axios from "axios";
import Pagination from "../components/Pagination";

const Home = () => {
  const [prod, setProd] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [filteredCategory, setFilteredCategory] = useState(null);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // slice your products array for current page

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/product");
        const data = await response.json();
        setProd(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (wishlistOpen) {
      const fetchWishlist = async () => {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          "http://localhost:5000/api/product/wishlist",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setWishlist(data);
      };
      fetchWishlist();
    }
  }, [wishlistOpen]);

  const toggleWishlist = async (productId) => {
    const token = localStorage.getItem("token");
    await axios.patch(
      `http://localhost:5000/api/product/${productId}/wishlist`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const { data: updatedWishlist } = await axios.get(
      "http://localhost:5000/api/product/wishlist",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setWishlist(updatedWishlist);
    const { data: allProducts } = await axios.get(
      "http://localhost:5000/api/product"
    );
    setProd(allProducts);
  };
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query) {
      setSearchedProducts([]);
      return;
    }
    try {
      const response = await axios.get("http://localhost:5000/api/product", {
        params: { q: query },
      });
      setSearchedProducts(response.data);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };
  const handleFilterChange = (categoryId, subcatIds) => {
    setFilteredCategory(categoryId);
    setFilteredSubcategories(subcatIds);
  };

  const baseProductList = searchQuery ? searchedProducts : prod;

  const filteredProducts = baseProductList.filter((product) => {
    if (filteredCategory && product.category !== filteredCategory) {
      return false;
    }
    if (
      filteredSubcategories.length > 0 &&
      !filteredSubcategories.includes(product.subcategory)
    ) {
      return false;
    }
    return true;
  });

    const pagedProducts = filteredProducts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className={styles.homeContainer}>
      <Header
        userName={JSON.parse(localStorage.getItem("user"))?.name || "User"}
        wishlist={wishlist}
        wishlistOpen={wishlistOpen}
        setWishlistOpen={setWishlistOpen}
        removeFromWishlist={toggleWishlist}
        onSearch={handleSearch}
      />
      <div className={styles.mainContent}>
        <Sidebar onFilterChange={handleFilterChange} />
        <div className={styles.productSection}>
          <ActionBar />
          <ProductGrid
            products={pagedProducts}
            userId={JSON.parse(localStorage.getItem("user"))?._id}
            toggleWishlist={toggleWishlist}
          />
          <Pagination
            totalItems={filteredProducts.length}
            currentPage={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>
    </div>
  );
};
export default Home;
