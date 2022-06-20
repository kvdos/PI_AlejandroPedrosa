import styles from "./EnquiryItem.module.css";
import { useContext, useState } from "react";
import Button from "../../shared/components/UI/Button";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import CardEnquiry from "./CardEnquiry";
import {
  Col,
  Container,
  Row,
  Modal,
  Button as ButtonBt,
} from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FiEdit, FiTrash } from "react-icons/fi";
import { FaExclamation } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import ShareLink from "../../components/ShareLink";
import { AuthContext } from "../../shared/context/auth-context";
import AlertError from "../../shared/components/UI/AlertError";

const EnquiryItem = (props) => {
  // Accedemos a nuestro objecto context para obtener el id del usuario
  const auth = useContext(AuthContext);
  // Uso de hook para redirigir
  const navigate = useNavigate();
  // Y para obtener el id de la consulta en caso de mostrar solo una
  const { enquiryId } = useParams();
  // States para gestionar la espera de la respuesta y los errores
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();
  // State para gestionar el modal de eliminación
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    // Al ejecutar, reseteamos el estado del error
    setError(null);
    // Ocultamos el modal de confirmación
    setShowConfirmModal(false);
    // Establecemos que estamos esperando la respuesta
    setIsLoading(true);
    // Hacemos la petición
    await axios
      .delete(process.env.REACT_APP_BACKEND_URL + `/consultas/${props.id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then(() => {
        // De eliminarse, nos dirigimos a las consultas
        navigate("/consultas");
      })
      .catch((err) => {
        // En caso de existir un error, lo almacenamos en el status 'error'
        setError(err);
      });
    // Independientemente de si hay respuesta o error, terminamos de cargar
    setIsLoading(false);
  };

  return (
    <>
      {!props.isShared && (
        <Modal show={showConfirmModal} onHide={cancelDeleteHandler}>
          <Modal.Header>
            <Modal.Title>Confirmación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            ¿Estás seguro de que deseas eliminar la consulta?
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
      )}
      <CardEnquiry
        className={`${
          props.isShared || enquiryId
            ? styles["full-enquiry"]
            : styles["short-enquiry"]
        } ${props.className}`}
      >
        {isLoading && <LoadingSpinner />}
        {error && <AlertError error={error} />}
        <Container className={styles.link}>
          <Link to={`${!props.isShared ? "/consultas/" + props.id : ""}`}>
            <Row className="p-2">
              {props.createdAt && (
                <Col xs={12} className="p-0">
                  <p className="m-0 text-start">{props.createdAt}</p>
                </Col>
              )}
              {props.location && (
                <Col xs={12} className="p-0 d-flex">
                  <MdLocationOn className="color-defecto my-auto" />
                  <p className="m-0 text-start">{props.location}</p>
                </Col>
              )}
              <Col xs={12} className="p-0 d-flex">
                <h3 className="m-0">{props.title}</h3>
                {props.change && (
                  <div className="ms-auto my-auto ps-2">
                    <FaExclamation className="text-white" />
                  </div>
                )}
              </Col>
            </Row>
          </Link>
        </Container>
        {!props.isShared && (
          <Container className={`border-top border-bottom ${styles.icon}`}>
            <Row>
              <Col className="text-center">
                <ShareLink
                  title={props.title}
                  id={props.id}
                  classNameBtn={"bg-gray"}
                />
              </Col>
              {enquiryId && (
                <>
                  <Col className="text-center border-start">
                    <Button
                      className="p-0 w-100 rounded-0"
                      onClick={props.onUpdateEnquiry}
                    >
                      <FiEdit className="my-1" />
                    </Button>
                  </Col>
                  <Col className="text-center border-start">
                    <Button
                      className="p-0 w-100 rounded-0"
                      onClick={showDeleteWarningHandler}
                    >
                      <FiTrash className="my-1" />
                    </Button>
                  </Col>
                </>
              )}
            </Row>
          </Container>
        )}
      </CardEnquiry>
    </>
  );
};

export default EnquiryItem;
