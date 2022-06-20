import styles from "./Button.module.css";

const Button = (props) => {
  return (
    <button
      type={props.type || "button"}
      disabled={props.disabled}
      className={`btn ${props.className} ${styles.btn} ${styles[props.color]}`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;
