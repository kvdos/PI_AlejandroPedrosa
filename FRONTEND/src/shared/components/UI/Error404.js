import styles from "./Error404.module.css";
import CardEnquiry from "../../../enquiries/components/CardEnquiry";
import { Link } from "react-router-dom";
import asking from "../../../Assets/Images/asking.jpg";
import confused from "../../../Assets/Images/confused.png";

const Error404 = (props) => {
  return (
    <CardEnquiry className={`border-0 p-2 pt-4 text-center ${styles.image}`}>
      <div className="text-center w-100 my-auto">
        <img
          src={props.imageSrc === "confused" ? confused : asking}
          className="align-top mb-3"
          alt="lost"
        />
      </div>
      {props.imageSrc === "confused" && (
        <h1 className="color-defecto">Error 404</h1>
      )}
      <h4 className="m-0">{props.message}</h4>
      <div className="text-decoration-none text-center my-2">
        <Link
          to={props.link}
          className="text-decoration-none fs-5 text-uppercase"
        >
          {props.textLink}
        </Link>
      </div>
    </CardEnquiry>
  );
};

export default Error404;
