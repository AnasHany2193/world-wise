import Map from "../components/Map";
import styles from "./AppLayout.module.css";
import Sidebar from "../components/Sidebar";

function AppLayout() {
  return (
    <div className={styles.app}>
      <Sidebar />
      <Map />
    </div>
  );
}

export default AppLayout;
