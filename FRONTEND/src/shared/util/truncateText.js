import styles from "./truncateText.module.css";
import { useState } from "react";
import Linkify from "react-linkify";

const ReadMore = ({ children, charLimit }) => {
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore((previsReadMore) => !previsReadMore);
  };

  return (
    <Linkify>
      {isReadMore ? children.slice(0, charLimit) : children}
      {!isReadMore && <br />}
      <span onClick={toggleReadMore} className={styles.link}>
        {children.length >= charLimit &&
          (isReadMore ? " ...leer más ▼" : " leer menos ▲")}
      </span>
    </Linkify>
  );
};

export default ReadMore;
