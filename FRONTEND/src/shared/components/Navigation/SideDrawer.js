import styles from "./SideDrawer.module.css";
import { Navbar, Nav, Offcanvas } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../../context/auth-context";
import { FaRegUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

const SideDrawer = () => {
  // Accedemos a nuestro objeto context para hacer 'logout' y obtener 'name' y 'email'
  const auth = useContext(AuthContext);

  return (
    <Navbar key="false" expand="false">
      <Navbar.Toggle
        className={`border-0 p-0 mx-auto ${styles["user-btn"]}`}
        aria-controls={`offcanvasNavbar-expand-false`}
      >
        <FaRegUserCircle className={styles["nav-icon"]} />
      </Navbar.Toggle>
      <Navbar.Offcanvas
        id={`offcanvasNavbar-expand-false`}
        aria-labelledby={`offcanvasNavbarLabel-expand-false`}
        placement="end"
        className={styles["offcanvas-cambios"]}
      >
        <Offcanvas.Header closeButton className="shadow">
          <Offcanvas.Title
            id={`offcanvasNavbarLabel-expand-false`}
            className={`w-100 text-center text-warning ${styles.title}`}
          >
            <h3 className="m-0">{auth.userInfo.name}</h3>
            <p className="m-0 fw-light">{auth.userInfo.email}</p>
            <p className="m-0 fw-light">{auth.userInfo.location}</p>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className={styles.link}>
          <Nav className="justify-content-end flex-grow-1 pe-3">
            <Nav.Link onClick={auth.logout}>
              <div className="d-flex justify-content-start">
                <div className="px-2">
                  <FiLogOut />
                </div>
                <div className="d-flex ps-1">
                  <p className="fw-bold my-auto">Cerrar sesión</p>
                </div>
              </div>
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Navbar.Offcanvas>
    </Navbar>
  );
};

export default SideDrawer;
