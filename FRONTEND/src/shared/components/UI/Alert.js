import styles from "./Alert.module.css";
import { useState } from "react";
import { Alert } from "react-bootstrap";
import { BiErrorCircle, BiCheckCircle } from "react-icons/bi";

const Alerta = (props) => {
  const [show, setShow] = useState(true);
  if (show) {
    return (
      <Alert
        variant={props.type}
        className={styles.alert}
        onClose={() => setShow(false)}
        dismissible
      >
        <Alert.Heading>
          {props.type === "success" ? <BiCheckCircle /> : <BiErrorCircle />}
        </Alert.Heading>
        <p className="m-0">{props.body}</p>
      </Alert>
    );
  }
};

export default Alerta;
