import styles from "./Enquiry.module.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import AlertError from "../../shared/components/UI/AlertError";
import { useParams } from "react-router-dom";
import EnquiryItem from "../components/EnquiryItem";
import CardEnquiry from "../components/CardEnquiry";
import Card from "../../shared/components/UI/Card";
import UpdateEnquiry from "../components/UpdateEnquiry";
import { Accordion } from "react-bootstrap";
import EnquiryAnswers from "../components/EnquiryAnswers";
import Helmet from "react-helmet";
import { formatDateTime } from "../../shared/util/dateTimeFormatter";
import { AuthContext } from "../../shared/context/auth-context";
import Linkify from "react-linkify";
import Error404 from "../../shared/components/UI/Error404";

const Enquiry = () => {
  // Accedemos a nuestro objecto context para obtener el id del usuario
  const auth = useContext(AuthContext);
  // States para gestionar la espera de la respuesta y los errores
  const [isLoading, setIsLoading] = useState(true); // Comenzamos spinner al esperar respuesta
  const [error, setError] = useState();
  // Obtenemos el id de la consulta
  let { enquiryId } = useParams();
  // State para almacenar y fijar la consulta devuelta
  const [loadedEnquiry, setLoadedEnquiry] = useState();
  // State para almacenar y fijar las respuestas a la consulta
  const [loadedAnswers, setLoadedAnswers] = useState();
  // State para indicar que queremos actualizar la consulta
  const [updateEnquiry, setUpdateEnquiry] = useState();
  // State volver a hacer la petición al servidor tras actualizar
  const [updated, setUpdated] = useState();

  useEffect(() => {
    const fetchEnquiry = async () => {
      // Al hacer submit, reseteamos el estado del error
      setError(null);
      // setUpdated(false);
      // Hacemos la petición
      await axios
        .get(process.env.REACT_APP_BACKEND_URL + `/consultas/${enquiryId}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        })
        .then((response) => {
          // Fijamos la respuesta en el state
          setLoadedEnquiry(response.data.enquiry);
          if (response.data.answers) {
            setLoadedAnswers(response.data.answers);
          }
        })
        .catch((err) => {
          // En caso de existir un error, lo almacenamos en el status 'error'
          setError(err);
        });
      // Independientemente de si hay respuesta o error, terminamos de cargar
      setIsLoading(false);
    };
    fetchEnquiry();
  }, [enquiryId, auth.token, updated]);

  // Funciones para gestionar state 'updateEnquiry' abrir el formulario de update (UpdateEnquiry)
  const enquiryUpdateHandler = () => {
    setUpdateEnquiry((prevupdateEnquiry) => !prevupdateEnquiry);
    // Fijamos el state de updated a false
    setUpdated(false);
  };

  const cancelUpdateHandler = () => {
    setUpdateEnquiry(false);
  };

  // Funciones para gestionar el state 'updated' cuando se actualiza
  const updatedHandler = () => {
    setUpdated(true);
  };

  // En caso de no tener la respuesta aún y no tener un error, seguimos cargando
  if (isLoading || (!loadedEnquiry && !error)) {
    return <LoadingSpinner />;
  }

  const errorStatus = [500, 404, 401];

  // En caso de producirse un error al identificar la consulta, mostramos aviso
  if (error && errorStatus.includes(error.response.status)) {
    return (
      <Error404
        link={"/"}
        textLink={"Volver a inicio"}
        imageSrc={"confused"}
        message={`${error.response.data.message}`}
      />
    );
  }

  // Mostramos descripción o el formulario de update
  const showConsulta =
    loadedEnquiry && updateEnquiry ? (
      <UpdateEnquiry
        enquiry={loadedEnquiry}
        onCancelUpdate={cancelUpdateHandler}
        onUpdated={setUpdated}
      ></UpdateEnquiry>
    ) : (
      <CardEnquiry className="my-2 p-2 border-0">
        <Linkify>
          <p className="m-0">{loadedEnquiry.description}</p>
        </Linkify>
      </CardEnquiry>
    );

  return (
    <>
      {error && <AlertError error={error} />}
      <Helmet>
        <title>{loadedEnquiry.title}</title>
        <meta name="description" content={`Consulta: ${loadedEnquiry.title}`} />
      </Helmet>
      <Card
        md={10}
        lg={8}
        className={`${styles.shadow} ${styles.icon} p-0 mt-2 mt-sm-3 mt-md-5`}
      >
        <EnquiryItem
          id={loadedEnquiry.id}
          title={loadedEnquiry.title}
          createdAt={formatDateTime(loadedEnquiry.createdAt)}
          updatedAt={formatDateTime(loadedEnquiry.updatedAt)}
          onUpdateEnquiry={enquiryUpdateHandler}
        />
        <Accordion defaultActiveKey={`${updateEnquiry || updated ? "0" : "1"}`}>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Consulta</Accordion.Header>
            <Accordion.Body className="p-0 show-breaks">
              {showConsulta}
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Respuestas</Accordion.Header>
            <Accordion.Body className="p-0">
              <EnquiryAnswers
                answers={loadedAnswers}
                title={loadedEnquiry.title}
                onUpdate={updatedHandler}
              />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card>
    </>
  );
};

export default Enquiry;
