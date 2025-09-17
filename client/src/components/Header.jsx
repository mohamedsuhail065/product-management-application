import React, { useState } from "react";
import styles from "./styles/Header.module.css";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { FiUser } from "react-icons/fi";
import WishlistDrawer from "./WislistDrawer";

const Header = ({
  userName,
  wishlist,
  wishlistOpen,
  setWishlistOpen,
  removeFromWishlist,
  onSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchClick = () => {
    onSearch(searchQuery.trim());
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.search}>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSearchClick}>Search</button>
      </div>
      <div className={styles.rightPane}>
        <IoIosHeartEmpty
          size={24}
          color="white"
          onClick={() => setWishlistOpen(true)}
          title="Open Wishlist"
          style={{ cursor: "pointer" }}
        />
        <WishlistDrawer
          isOpen={wishlistOpen}
          onClose={() => setWishlistOpen(false)}
          wishlist={wishlist}
          onRemove={removeFromWishlist}
        />
        <IoCartOutline size={24} color="white" title="Cart" />
        <div className={styles.profile}>
          <FiUser size={24} style={{ marginLeft: "10px" }} color="white" />
          <span>{userName}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
