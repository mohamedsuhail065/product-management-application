import { useEffect, useState } from "react";
import ActionBar from "../components/ActionBar";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import styles from "./styles/Home.module.css";
import ProductGrid from "../components/ProductGrid";
import axios from "axios";

const Home = () => {
  const [prod, setProd] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistOpen, setWishlistOpen] = useState(false);
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

    // Update wishlist and products accordingly
    const { data: updatedWishlist } = await axios.get(
      "http://localhost:5000/api/product/wishlist",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setWishlist(updatedWishlist);

    // Optionally refresh all products or update products state locally
    const { data: allProducts } = await axios.get(
      "http://localhost:5000/api/product"
    );
    setProd(allProducts);
  };

  return (
    <div className={styles.homeContainer}>
      <Header
        userName={JSON.parse(localStorage.getItem("user"))?.name || "User"}
        wishlist={wishlist}
        wishlistOpen={wishlistOpen}
        setWishlistOpen={setWishlistOpen}
        removeFromWishlist={toggleWishlist}
      />
      <div className={styles.mainContent}>
        <Sidebar />
        <div className={styles.productSection}>
          <ActionBar />
          <ProductGrid
            products={prod}
            userId={JSON.parse(localStorage.getItem("user"))?._id}
            toggleWishlist={toggleWishlist}
          />
          {/* <Pagination /> */}
        </div>
      </div>
    </div>
  );
};
export default Home;
