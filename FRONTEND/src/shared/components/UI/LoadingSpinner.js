import styles from "./LoadingSpinner.module.css";
import { ImSpinner2 } from "react-icons/im";

const LoadingSpinner = (props) => {
  return (
    <div className={`${props.asOverlay} && ${styles["spinner__overlay"]}`}>
      <ImSpinner2 className={styles.spinner} />
    </div>
  );
};

export default LoadingSpinner;
