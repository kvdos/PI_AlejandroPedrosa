import { useContext, useState, useEffect } from "react";
import Card from "../../shared/components/UI/Card";
import Button from "../../shared/components/UI/Button";
import Input from "../../shared/components/FormElements/Input";
import { Formik, Form, useFormikContext } from "formik";
import * as Yup from "yup";
import axios from "axios";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useNavigate } from "react-router-dom";
import Helmet from "react-helmet";
import AlertError from "../../shared/components/UI/AlertError";
import SharedView from "../components/SharedView";
import { Modal } from "react-bootstrap";

const NewEnquiryForm = () => {
  // Accedemos a nuestro objecto context para la Authorization y la location
  const auth = useContext(AuthContext);

  // State para acceder a los valores de los inputs y mostrar preview
  const [isValid, setIsValid] = useState(false);
  // State para almacenar los valores una vez validados y mostrar en preview
  const [validValues, setValidValues] = useState();

  // States para gestionar la espera de la respuesta y los errores
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();

  const validate = Yup.object({
    title: Yup.string()
      .max(85, "Has excedido el máximo de 85 caracteres")
      .min(4, "El título debe tener más de 4 caracteres")
      .required("El título es obligatorio"),
    description: Yup.string()
      .max(3000, "Has excedido el máximo de 5000 caracteres")
      .min(60, "La consulta debe tener más de 60 caracteres")
      .required("La consulta es obligatoria"),
  });

  // Preview
  const CheckValueContext = () => {
    // Obtenemos los valores del contexto
    const { values } = useFormikContext();
    useEffect(() => {
      // Función para habilitar botón de preview y valores a mostrar
      const getValidPreview = (valid) => {
        setIsValid(valid);
        setValidValues(values);
      };
      // Cuando cambian, los validamos y de ser OK, habilitamos preview
      validate.isValid(values).then((valid) => getValidPreview(valid));
    }, [values]);
  };

  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);

  const handleShow = (breakpoint) => {
    setFullscreen(breakpoint);
    setShow(true);
  };

  // Hook para redirigir a la consulta tras submitting
  const navigate = useNavigate();

  // Función que se ejecuta al hacer submit en el formulario
  const onSubmit = async (values) => {
    values = { ...values, location: auth.userInfo.location };
    // Al hacer submit, reseteamos el estado del error
    setError(null);
    // Establecemos que estamos esperando la respuesta
    setIsLoading(true);
    // Hacemos la petición
    await axios
      .post(process.env.REACT_APP_BACKEND_URL + "/consultas", values, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })
      // Redirigir al usuario a la página donde se muestra la consulta creada
      .then((response) => navigate(`/consultas/${response.data.enquiry._id}`))
      .catch((err) => {
        // En caso de existir un error, lo almacenamos en el status 'error'
        setError(err);
      });
    // Independientemente de si hay respuesta o error, terminamos de cargar
    setIsLoading(false);
  };

  return (
    <>
      {error && <AlertError error={error} />}
      {isLoading && <LoadingSpinner />}
      <Helmet>
        <title>Consultar</title>
        <meta
          name="description"
          content="Crea esa consulta de la que te gustaría recibir respuestas"
        />
      </Helmet>
      {show && (
        <Modal
          show={show}
          fullscreen={fullscreen}
          onHide={() => setShow(false)}
        >
          <Modal.Header className="bg-defecto text-white" closeButton>
            <Modal.Title>Vista previa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <SharedView
              title={validValues.title}
              location={auth.userInfo.location}
              description={validValues.description}
              preview={true}
            />
          </Modal.Body>
        </Modal>
      )}
      <Card className="my-4" md={10} lg={8}>
        <h1 className="text-center color-defecto">¿Qué deseas consultar?</h1>
        <Formik
          initialValues={{
            title: "",
            description: "",
          }}
          validationSchema={validate}
          onSubmit={onSubmit}
        >
          {(formik) => (
            <Form className="mt-4">
              <CheckValueContext />
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
              <div className="d-flex">
                <div className="w-50 text-end px-2">
                  <Button
                    disabled={!isValid}
                    className="rounded-pill"
                    color="btn-extra"
                    onClick={() => handleShow("md-down")}
                  >
                    Ver vista previa
                  </Button>
                </div>
                <div className="w-50 text-start px-2">
                  <Button
                    type="submit"
                    className="rounded-pill"
                    color="btn-submit"
                  >
                    Crear consulta
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </>
  );
};

export default NewEnquiryForm;
