import styles from "../components/EnquiryAnswers.module.css";
import { useState } from "react";
import Button from "../../shared/components/UI/Button";
import { Row, Col, Container } from "react-bootstrap";
import CardEnquiry from "./CardEnquiry";
import AnswerList from "./AnswerList";
import AlertSuccess from "../../shared/components/UI/AlertSuccess";
import ShareLink from "../../components/ShareLink";

const EnquiryAnswers = (props) => {
  // State para almacenar y fijar la respuesta
  const [loadedAnswers, setLoadedAnswers] = useState(props.answers);
  // State para mostrar favoritos o no
  const [favList, setFavList] = useState(false);
  // State para almacenar la respuesta del servidor al eliminar
  const [resDelete, setResDelete] = useState();

  //Función que pasamos como props a AnswerList > AnswerItem para obtener id + deleteMsg
  const answerDeletedHandler = (deletedAnswerId, message) => {
    // Actualizo la lista de respuestas filtrando fuera la eliminada
    setLoadedAnswers((prevAnswers) =>
      prevAnswers.filter((answer) => answer.id !== deletedAnswerId)
    );
    // Guardamos el mensaje de la respuesta del servidor al eliminar una answer
    setResDelete(message);
  };

  // Para actualizar las listas en base a la propiedad 'favourite', almacenamos las respuestas
  const answers = loadedAnswers;

  //Función que pasamos como props a AnswerList > AnswerItem para obtener id + favourite actual
  const answerUpdatedHandler = ({ updatedAnswerId, favourite }) => {
    // Actualizamos en nuestras respuestas su campo de 'favourite' al no hacer nueva petición
    answers.forEach((answer) => {
      if (answer.id === updatedAnswerId)
        return Object.assign(answer, { favourite: favourite });
    });
  };

  // Contamos las respuestas para mostrarlas según el apartado
  let favItems = 0;
  let otherItems = 0;
  if (answers) {
    // Obtenemos el total de respuestas
    const totalItems = answers.length;
    // Obtenemos el total de favoritos
    answers.forEach((answer) => {
      if (answer.favourite === true) favItems++;
    });
    // Obtenemos el total de otras respuestas en base a los dos anteriores
    otherItems = totalItems - favItems;
  }

  // En caso de no existir respuestas a la consulta, lo avisamos
  if (!answers) {
    return (
      <CardEnquiry className={"border-0 my-2 p-2 text-center"}>
        <h4>No tienes respuestas actualmente</h4>
        <p className="m-0">¡Comparte la consulta con tus conocidos!</p>
        <ShareLink
          classNameBtn="color-defecto"
          title={props.title}
          id={props.enquiryId}
        />
      </CardEnquiry>
    );
  }

  return (
    <>
      {resDelete && <AlertSuccess message={resDelete} />}
      <ul className="list-unstyled">
        <Container fluid className="m-0 p-0">
          <Row className={`pt-2 ${styles.options}`}>
            <Col className="pe-0 text-center">
              <Button
                className={`px-0 py-1 ${styles.tab} ${
                  favList ? styles.left : ""
                }`}
                onClick={() => {
                  setFavList(true);
                  setResDelete(null);
                }}
              >
                <p className="m-0 color-defecto">Favoritas ({favItems})</p>
              </Button>
            </Col>
            <Col className="ps-0 text-center">
              <Button
                className={`px-0 py-1 ${styles.tab} ${
                  favList ? "" : styles.right
                }`}
                onClick={() => {
                  setFavList(false);
                  setResDelete(null);
                }}
              >
                <p className="m-0 color-defecto">Otras ({otherItems})</p>
              </Button>
            </Col>
          </Row>
          <AnswerList
            items={answers.filter((answer) => answer.favourite === favList)}
            onDeleteAnswer={answerDeletedHandler}
            favList={favList}
            onUpdateAnswers={answerUpdatedHandler}
          />
        </Container>
      </ul>
    </>
  );
};

export default EnquiryAnswers;
