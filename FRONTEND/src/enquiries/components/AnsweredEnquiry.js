import { useNavigate } from "react-router-dom";
import Card from "../../shared/components/UI/Card";
import { Row, Col } from "react-bootstrap";
import Button from "../../shared/components/UI/Button";

const AnsweredEnquiry = () => {
  // Uso de hook para redirigir
  const navigate = useNavigate();

  return (
    <Card xs={12} sm={10} md={8}>
      <Row>
        <Col xs={12} className="text-center mt-5">
          <h2 className="color-defecto">¡Gracias por responder la consulta!</h2>
        </Col>
        <Col xs={12} md={6} className="text-center mt-4">
          <p>¿Tienes cuenta? ¡Inicia sesión!</p>
          <Button color="btn-submit" onClick={() => navigate("/login")}>
            Iniciar sesión
          </Button>
        </Col>
        <Col xs={12} md={6} className="text-center mt-4">
          <p>¡O regístrate y comienza a resolver tus dudas!</p>
          <Button color="btn-extra" onClick={() => navigate("/signup")}>
            Regístrarme
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default AnsweredEnquiry;
