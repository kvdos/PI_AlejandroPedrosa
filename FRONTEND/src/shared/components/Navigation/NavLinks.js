import styles from "./NavLinks.module.css";
import { NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { BsPencilSquare, BsDot } from "react-icons/bs";
import { FaComments } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../../context/auth-context";

const NavLinks = () => {
  // Declaramos el objeto que guardará el último contexto y que provocará que
  // el componente vuelva a cargarse en base a este
  const auth = useContext(AuthContext);

  return (
    <Nav className="w-100 justify-content-evenly">
      {auth.isLoggedIn && (
        <Nav.Item className={styles["position-relative"]}>
          <NavLink
            to="/consultas/nueva"
            className={(navData) =>
              navData.isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            <BsPencilSquare className={styles["nav-icon"]} />
            <BsDot className={styles["icon-current"]} />
            <span className={styles["link-title"]}>Consultar</span>
          </NavLink>
        </Nav.Item>
      )}
      {auth.isLoggedIn && (
        <Nav.Item className={styles["position-relative"]}>
          <NavLink
            to="consultas"
            end
            className={(navData) =>
              navData.isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            <FaComments className={styles["nav-icon"]} />
            <BsDot className={styles["icon-current"]} />
            <span className={styles["link-title"]}>Mis consultas</span>
          </NavLink>
        </Nav.Item>
      )}
    </Nav>
  );
};

export default NavLinks;
