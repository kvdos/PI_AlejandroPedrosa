import styles from "./MainNavigation.module.css";
import MainHeader from "./MainHeader";
import SideDrawer from "./SideDrawer";
import { Link } from "react-router-dom";
import { Navbar, Container, Row, Col } from "react-bootstrap";
import logo from "../../../Assets/Images/logo.png";
import NavLinks from "./NavLinks";
import { useContext } from "react";
import { AuthContext } from "../../context/auth-context";

const MainNavigation = () => {
  // Declaramos el objeto que guardará el último contexto y que provocará que
  // el componente vuelva a cargarse en base a este
  const auth = useContext(AuthContext);

  return (
    <MainHeader>
      <Container>
        <Row>
          <Col xs={10}>
            <Navbar className={`${styles["full-height"]}`}>
              <Navbar.Brand>
                <Link to="/">
                  <img
                    src={logo}
                    width="100"
                    className="d-inline-block align-top"
                    alt="logo"
                  />
                </Link>
              </Navbar.Brand>
              <NavLinks />
            </Navbar>
          </Col>
          {auth.isLoggedIn && (
            <Col xs={2} className="my-auto">
              <SideDrawer />
            </Col>
          )}
        </Row>
      </Container>
    </MainHeader>
  );
};

export default MainNavigation;
