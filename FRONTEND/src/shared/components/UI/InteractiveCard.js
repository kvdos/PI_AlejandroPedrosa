import styles from "./InteractiveCard.module.css";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Button from "./Button";
import { useState } from "react";

const InteractiveCard = (props) => {
  const propsEstilos = props.className.split(" ");

  const [text, setText] = useState(false);

  const content = (
    <Row className={styles["full-height"]}>
      <Col className={`my-auto ${styles.zoom}`}>{props.children}</Col>
    </Row>
  );

  const action = props.path ? (
    <Link to={props.path} className="text-decoration-none p-0">
      {content}
    </Link>
  ) : (
    <Button
      className={`${styles.btn} ${text && styles["show-text"]}`}
      onClick={() => setText((prevtext) => !prevtext)}
    >
      {content}
    </Button>
  );

  return (
    <Col
      xs={props.xs}
      md={props.md}
      className={`text-center ${
        styles[propsEstilos[0]] + " " + styles[propsEstilos[1]]
      }`}
    >
      {action}
    </Col>
  );
};

export default InteractiveCard;
