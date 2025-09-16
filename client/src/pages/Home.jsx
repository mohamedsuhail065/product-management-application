import ActionBar from "../components/ActionBar";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import styles from "./styles/Home.module.css";

const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <Header />
      <div className={styles.mainContent}>
        <Sidebar />
        <div className={styles.productSection}>
          <ActionBar />
          {/* <ProductGrid />
          <Pagination /> */}
        </div>
      </div>
    </div>
  );
};
export default Home;
