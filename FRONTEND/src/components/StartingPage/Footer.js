import LinkFooter from "./LinkFooter";
import { Col } from "react-bootstrap";

const Footer = () => {
  return (
    <Col
      style={{ height: "10vh" }}
      className="d-flex justify-content-center bg-secondary"
    >
      <LinkFooter path="/" className="border-end border-light">
        Legal
      </LinkFooter>
      <LinkFooter path="/" className="border-end border-light">
        Privacidad
      </LinkFooter>
      <LinkFooter path="/" className="border-end border-light">
        Cookies
      </LinkFooter>
      <LinkFooter path="/" className="border-light">
        Contacto
      </LinkFooter>
    </Col>
  );
};

export default Footer;
