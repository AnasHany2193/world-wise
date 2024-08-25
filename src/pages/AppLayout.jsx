import Map from "../components/Map";
import User from "../components/User";
import styles from "./AppLayout.module.css";
import Sidebar from "../components/Sidebar";

function AppLayout() {
  return (
    <div className={styles.app}>
      <Sidebar />
      <Map />
      <User />
    </div>
  );
}

export default AppLayout;
