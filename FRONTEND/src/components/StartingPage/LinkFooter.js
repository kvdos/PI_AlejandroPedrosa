import styles from "./LinkFooter.module.css";
import { Link } from "react-router-dom";

const LinkFooter = (props) => {
  return (
    <div
      className={`${props.className} ${styles.link} my-auto text-center px-3`}
    >
      <Link to={props.path} className="text-decoration-none text-light">
        {props.children}
      </Link>
    </div>
  );
};

export default LinkFooter;
