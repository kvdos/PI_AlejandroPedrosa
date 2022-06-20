import { useState, useContext } from "react";
import Card from "../../shared/components/UI/Card";
import Button from "../../shared/components/UI/Button";
import Input from "../../shared/components/FormElements/Input";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import CardEnquiry from "./CardEnquiry";
import { Row, Col } from "react-bootstrap";
import AlertError from "../../shared/components/UI/AlertError";

const UpdateEnquiry = (props) => {
  // Accedemos a nuestro objecto context para obtener el id del usuario
  const auth = useContext(AuthContext);
  // States para gestionar la espera de la respuesta y los errores
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();
  // Obtenemos el id de la consulta
  let { enquiryId } = useParams();

  const validate = Yup.object({
    title: Yup.string()
      .max(85, "Has excedido el máximo de 85 caracteres")
      .min(4, "El título debe tener más de 4 caracteres")
      .required("El título es obligatorio"),
    description: Yup.string()
      .max(5000, "Has excedido el máximo de 5000 caracteres")
      .min(60, "La consulta debe tener más de 60 caracteres")
      .required("La consulta es obligatoria"),
  });

  const navigate = useNavigate();

  // Función que se ejecuta al hacer submit en el formulario
  const onSubmit = async (values) => {
    // Al hacer submit, reseteamos el estado del error
    setError(null);
    // Establecemos que estamos esperando la respuesta
    setIsLoading(true);
    // Hacemos la petición
    const response = await axios
      .patch(
        process.env.REACT_APP_BACKEND_URL + `/consultas/${enquiryId}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      )
      .catch((err) => {
        // En caso de existir un error, lo almacenamos en el status 'error'
        setError(err);
      });
    // Si no hay error, reseteamos el formulario
    if (response) {
      // Redirigir al usuario a la página donde se muestra la consulta creada
      navigate(`/consultas/${enquiryId}`);
      // Cerramos el componente UpdateEnquiry
      props.onCancelUpdate();
      // Hacemos que la petición se repita con los datos actualizados
      props.onUpdated(true);
    }
    // Independientemente de si hay respuesta o error, terminamos de cargar
    setIsLoading(false);
  };

  // Mientras esperamos la respuesta
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // En caso de no existir la consulta y no haber un error
  if (!props.enquiry && !error) {
    return (
      <CardEnquiry className={"my-2 p-2 text-center text-white bg-danger"}>
        <p className="m-0">No se ha encontrado la consulta...</p>
      </CardEnquiry>
    );
  }

  // Cuando existe la consulta
  return (
    <Card xs={12} lg={9}>
      {error && <AlertError error={error} />}
      <Formik
        initialValues={{
          title: props.enquiry.title,
          description: props.enquiry.description,
        }}
        validationSchema={validate}
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form className="mt-3">
            <Input
              element="input"
              labelfloating="Título (mínimo de 4 caracteres)"
              name="title"
              type="text"
              placeholder="Que resuma brevemente la consulta"
            />
            <Input
              element="textarea"
              labelfloating="Consulta (mínimo de 60 caracteres)"
              name="description"
              as="textarea"
              placeholder="Que resuma brevemente la consulta"
            />
            <Row>
              <Col className="text-end mb-3">
                <Button
                  className="rounded-pill"
                  color="btn-cancel"
                  onClick={props.onCancelUpdate}
                >
                  Cancelar
                </Button>
              </Col>
              <Col className="text-start">
                <Button
                  type="submit"
                  className="rounded-pill"
                  color="btn-submit"
                >
                  Actualizar
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default UpdateEnquiry;
