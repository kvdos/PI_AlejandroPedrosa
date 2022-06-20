import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import AlertError from "../../shared/components/UI/AlertError";
import Error404 from "../../shared/components/UI/Error404";
import { useParams } from "react-router-dom";
import Helmet from "react-helmet";
import SharedView from "../components/SharedView";

const EnquiryShared = () => {
  // States para gestionar la espera de la respuesta y los errores
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();
  // Obtenemos el id de la consulta
  let { enquiryId } = useParams();
  // State para almacenar y fijar la respuesta
  const [loadedEnquiry, setLoadedEnquiry] = useState();

  useEffect(() => {
    const fetchEnquiry = async () => {
      // Al hacer submit, reseteamos el estado del error
      setError(null);
      // Señalamos que estamos cargando mientras esperamos respuesta
      setIsLoading(true);
      // Hacemos la petición
      await axios
        .get(
          process.env.REACT_APP_BACKEND_URL + `/consultas/shared/${enquiryId}`
        )
        .then((response) => {
          // Fijamos la respuesta en el state
          setLoadedEnquiry(response.data.enquiry);
        })
        .catch((err) => {
          // En caso de existir un error, lo almacenamos en el status 'error'
          setError(err);
        });
      // Independientemente de si hay respuesta o error, terminamos de cargar
      setIsLoading(false);
    };
    fetchEnquiry();
  }, [enquiryId]);

  // Mientras esperamos la respuesta
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // En caso de no tener la respuesta y no tener un error, seguimos cargando
  if (!loadedEnquiry && !error) {
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

  return (
    <>
      <Helmet>
        <title>Consulta</title>
        <meta
          name="description"
          content="¿Tienes una respuesta a esta consulta?"
        />
      </Helmet>
      {error && <AlertError error={error} />}
      <SharedView
        title={loadedEnquiry.title}
        location={loadedEnquiry.location}
        description={loadedEnquiry.description}
        enquiryId={enquiryId}
        charLimit={150}
      />
    </>
  );
};

export default EnquiryShared;
