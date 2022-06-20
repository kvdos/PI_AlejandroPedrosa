import { Container, Row, Col } from "react-bootstrap";

const Card = (props) => {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col
          // Añadimos las clases de estilo de Card, las que damos al usar el componente y las de bootstrap:
          className={props.className}
          xs={props.xs}
          sm={props.sm}
          md={props.md}
          lg={props.lg}
        >
          {props.children}
        </Col>
      </Row>
    </Container>
  );
};

export default Card;
