import styles from "./styles/Header.module.css";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { FiUser } from "react-icons/fi";
import WishlistDrawer from "./WislistDrawer";

const Header = ({userName,
  wishlist,
  wishlistOpen,
  setWishlistOpen,
  removeFromWishlist,}) => {

  return (
    <div className={styles.container}>
      <div className={styles.search}>
        <input type="text" placeholder="Search" />
        <button>Search</button>
      </div>
      <div className={styles.rightPane}>
        <IoIosHeartEmpty
          size={24}
          color="white"
          onClick={()=>setWishlistOpen(true)}
        />
        <WishlistDrawer
          isOpen={wishlistOpen}
          onClose={() => setWishlistOpen(false)}
          wishlist={wishlist}
          onRemove={removeFromWishlist}
        />
        <IoCartOutline size={24} color="white" />
        <div className={styles.profile}>
          <FiUser size={24} style={{ marginLeft: "10px" }} color="white" />
          <span>{userName}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
