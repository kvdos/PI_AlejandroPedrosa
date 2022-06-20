import EnquiryList from "../components/EnquiryList";
import axios from "axios";
import { useState, useContext, useEffect } from "react";
import Card from "../../shared/components/UI/Card";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import Error404 from "../../shared/components/UI/Error404";
import { AuthContext } from "../../shared/context/auth-context";
import Helmet from "react-helmet";
import AlertError from "../../shared/components/UI/AlertError";

const UserEnquiries = () => {
  // Accedemos a nuestro objeto context
  const auth = useContext(AuthContext);
  // State para almacenar y fijar la respuesta
  const [loadedEnquiries, setLoadedEnquiries] = useState();
  // States para gestionar la espera de la respuesta y los errores
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const fetchPlaces = async () => {
      // Al hacer submit, reseteamos el estado del error
      setError(null);
      // Fijamos el state del spinner a true mientras esperamos respuesta
      setIsLoading(true);
      // Hacemos la petición
      await axios
        .get(process.env.REACT_APP_BACKEND_URL + `/consultas`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        })
        .then((response) => {
          // Fijamos la respuesta en el state
          setLoadedEnquiries(response.data.enquiries);
        })
        .catch((err) => {
          // En caso de existir un error, lo almacenamos en el status 'error'
          setError(err);
        });
      // Independientemente de si hay respuesta o error, terminamos de cargar
      setIsLoading(false);
    };
    fetchPlaces();
  }, [auth.token]);

  // Mientras esperamos la respuesta
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // En caso de no existir consultas, lo mostramos
  if (!isLoading && error && error.response.status === 404) {
    return (
      <>
        <h1 className="text-center pt-4 mb-3 color-defecto">Mis consultas</h1>
        <p className="text-center">No tienes actualmente consultas.</p>
        <Error404
          link={"/consultas/nueva"}
          textLink={"Crear consulta"}
          imageSrc={"asking"}
          message={"¡Crea una consulta y compártela!"}
        />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Consultas</title>
        <meta name="description" content="Todas tus consultas en un vistazo" />
      </Helmet>
      <Card md={10} lg={8} className="mt-4">
        {error && <AlertError error={error} />}
        {!isLoading && loadedEnquiries && (
          <EnquiryList items={loadedEnquiries} />
        )}
      </Card>
    </>
  );
};

export default UserEnquiries;
