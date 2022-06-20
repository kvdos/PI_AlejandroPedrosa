import styles from "./CardEnquiry.module.css";

const CardEnquiry = (props) => {
  return (
    <div
      className={`${props.className} ${styles.CardEnquiry}`}
      style={props.style}
    >
      {props.children}
    </div>
  );
};

export default CardEnquiry;
