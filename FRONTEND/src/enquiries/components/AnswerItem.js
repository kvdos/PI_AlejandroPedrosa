import styles from "./AnswerItem.module.css";
import { useState, useEffect, useContext, useRef } from "react";
import Button from "../../shared/components/UI/Button";
import {
  Col,
  Container,
  Row,
  Modal,
  Button as ButtonBt,
} from "react-bootstrap";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { FiTrash } from "react-icons/fi";
import { FaExclamation } from "react-icons/fa";
import { formatDateTime } from "../../shared/util/dateTimeFormatter";
import ReadMore from "../../shared/util/truncateText";
import { AuthContext } from "../../shared/context/auth-context";
import { logTime } from "../../shared/util/logTime";
import AlertError from "../../shared/components/UI/AlertError";

const EnquiryItem = (props) => {
  // Accedemos a nuestro objecto context para obtener el id del usuario
  const auth = useContext(AuthContext);
  // Uso de hook para redirigir
  const navigate = useNavigate();
  // Obtenemos el pathname actual para mantenernos en él al borrar respuestas
  const { pathname } = useLocation();

  const [error, setError] = useState();
  // State para gestionar el valor del favorito recibiendo valor inicial
  const [favourite, setFavourite] = useState(props.favourite);
  // State para gestionar el modal de eliminación
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Funciones para gestionar el state del modal de eliminación
  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };
  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  // DELETE
  const confirmDeleteHandler = async () => {
    // Al ejecutar, reseteamos el estado del error
    setError(null);
    // Ocultamos el modal de confirmación
    setShowConfirmModal(false);
    // Hacemos la petición
    await axios
      .delete(process.env.REACT_APP_BACKEND_URL + `/respuestas/${props.id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((response) => {
        // De eliminarse, actualizamos los states del listado de answers en EnquiryAnswers
        props.onDelete(props.id, response.data.message);
        // Nos dirigimos a la propia consulta con el 'pathname' guardado
        navigate(pathname);
      })
      .catch((err) => {
        // En caso de existir un error, lo almacenamos en el status 'error'
        setError(err);
      });
  };

  // UPDATE con useEffect para efectuar el cambio de favorito al cambiar el state
  // State que almacenará la respuesta del servidor al hacer update y que nos servirá
  // para pasar los datos al componente padre y renderizar las dos listas
  const [responseUpdate, setResponseUpdate] = useState();
  // ref para controlar si hemos renderizado por 1ª vez el componente y ejecutar useEffect solo por dependencias
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      const updateAnswer = async () => {
        // Al hacer click en el icono del corazón, reseteamos el estado del error
        setError(null);
        // Hacemos la petición
        await axios
          .patch(
            process.env.REACT_APP_BACKEND_URL + `/respuestas/${props.id}`,
            {
              favourite: favourite,
            },
            {
              headers: {
                Authorization: `Bearer ${auth.token}`,
              },
            }
          )
          .then((response) => {
            // Obtenemos el valor de favourite de la respuesta del servidor
            const favourite =
              JSON.stringify(response.data.answer)
                .split(",")[2]
                .split(":")[1] === "true";
            // Actualizamos el state para guardar id y favourite
            setResponseUpdate({ updatedAnswerId: props.id, favourite });
          })
          .catch((err) => {
            // En caso de existir un error, lo almacenamos en el status 'error'
            setError(err);
          });
      };
      // Ejecutamos la func de update
      updateAnswer();
    } else {
      didMount.current = true;
    }
    // Fijamos las dependencias del useEffect
  }, [props.id, auth.token, favourite]);

  // De haberse hecho update, mandamos los datos al componente EnquiryAnswers
  if (responseUpdate) {
    props.onUpdate(responseUpdate);
  }

  // Comprobamos si la respuesta es posterior a la última conexión
  let newAnswer = false;
  const logged = logTime();
  if (logged) {
    newAnswer = new Date(props.createdAt) > logged;
  }

  return (
    <>
      <Modal show={showConfirmModal} onHide={cancelDeleteHandler}>
        <Modal.Header>
          <Modal.Title>Confirmación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar la respuesta?
        </Modal.Body>
        <Modal.Footer>
          <ButtonBt variant="secondary" onClick={cancelDeleteHandler}>
            Cancelar
          </ButtonBt>
          <ButtonBt variant="danger" onClick={confirmDeleteHandler}>
            Eliminar
          </ButtonBt>
        </Modal.Footer>
      </Modal>
      {error && <AlertError error={error} />}
      <Container>
        <Row className="px-3 pt-2">
          <Col xs={12} className="d-flex p-0">
            <p className={`text-secondary mb-1 ${styles.date}`}>
              {formatDateTime(props.createdAt)}
            </p>
            {newAnswer && (
              <FaExclamation className="ms-auto my-auto text-success" />
            )}
          </Col>
          <Col xs={12} className="p-0">
            <p className="m-0 show-breaks">
              <ReadMore charLimit={150}>{props.text}</ReadMore>
            </p>
          </Col>
          <Col xs={12} className="p-0">
            <Row className="justify-content-end pe-2">
              <Col xs="auto" className="p-0">
                <Button
                  className="p-0 pe-3 rounded-0"
                  onClick={() => {
                    setFavourite((prevfavourite) => !prevfavourite);
                  }}
                >
                  <FiHeart
                    className={`my-1 ${
                      favourite ? styles["heart-clicked"] : styles.icon
                    }`}
                  />
                </Button>
              </Col>
              <Col xs="auto" className="p-0">
                <Button
                  className="p-0 rounded-0"
                  onClick={showDeleteWarningHandler}
                >
                  <FiTrash className={`my-1 ${styles.icon}`} />
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default EnquiryItem;
