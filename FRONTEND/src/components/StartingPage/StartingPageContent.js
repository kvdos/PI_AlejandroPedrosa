import InteractiveCard from "../../shared/components/UI/InteractiveCard";
import styles from "./StartingPageContent.module.css";
import { BsQuestionDiamondFill } from "react-icons/bs";
import { AiOutlineFolderOpen } from "react-icons/ai";
import { Container, Row } from "react-bootstrap";
import Footer from "./Footer";

const StartingPageContent = () => {
  return (
    <Container fluid className={styles.content}>
      <Row>
        <InteractiveCard
          xs={12}
          md={6}
          className={"bg-amarillo size-medium"}
          path={"/consultas/nueva"}
        >
          <h2>¿Qué deseas preguntar?</h2>
          <BsQuestionDiamondFill size="3rem" />
        </InteractiveCard>
        <InteractiveCard
          xs={12}
          md={6}
          className={"bg-blue size-small-expand"}
          path={"/consultas"}
        >
          <h2>Mi historial de consultas</h2>
          <AiOutlineFolderOpen size="3rem" />
        </InteractiveCard>
        <InteractiveCard
          xs={12}
          md={12}
          className={"bg-verde size-medium-expand"}
        >
          <h2>¿Qué es Diskoza?</h2>
          <p>
            Diskoza te ayuda a obtener respuestas a tus dudas gracias a la
            posibilidad de compartir el enlace a la consulta que generes con tu
            red de contactos, los cuales, a su vez, podrán introducirla en sus
            redes para dar con la mejor respuesta.
          </p>
        </InteractiveCard>
        <Footer />
      </Row>
    </Container>
  );
};

export default StartingPageContent;
