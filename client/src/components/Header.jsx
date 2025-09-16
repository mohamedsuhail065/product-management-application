import styles from "./styles/Header.module.css";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { FiUser } from "react-icons/fi";

const Header = () => {
  const userName = JSON.parse(localStorage.getItem("user"))?.name || "User";
  return (
    <div className={styles.container}>
      <div className={styles.search}>
        <input type="text" placeholder="Search" />
        <button>Search</button>
      </div>
      <div className={styles.rightPane}>
        <IoIosHeartEmpty size={24} color="white" />
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
