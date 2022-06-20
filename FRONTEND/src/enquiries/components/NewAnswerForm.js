// import styles from "./NewEnquiryForm.module.css";
import { useState } from "react";
import Card from "../../shared/components/UI/Card";
import Button from "../../shared/components/UI/Button";
import Input from "../../shared/components/FormElements/Input";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import AlertError from "../../shared/components/UI/AlertError";
import { useNavigate } from "react-router-dom";

const NewAnswerForm = (props) => {
  // States para gestionar la espera de la respuesta y los errores
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();

  const validate = Yup.object({
    text: Yup.string()
      .max(5000, "Has excedido el máximo de 5000 caracteres")
      .required("La respuesta es obligatoria"),
  });

  const navigate = useNavigate();

  // Función que se ejecuta al hacer submit en el formulario
  const onSubmit = async (values) => {
    // Objeto con los valores de la consulta
    values = {
      ...values,
      enquiryId: props.enquiryId,
    };
    // Al hacer submit, reseteamos el estado del error
    setError(null);
    // Establecemos que estamos esperando la respuesta
    setIsLoading(true);
    // Hacemos la petición
    await axios
      .post(process.env.REACT_APP_BACKEND_URL + "/respuestas", values)
      // Redirigir al usuario a la página donde se muestra la consulta creada
      .then(() => navigate("/consultas/respondida"))
      .catch((err) => {
        // En caso de existir un error, lo almacenamos en el status 'error'
        setError(err);
      });
    // Independientemente de si hay respuesta o error, terminamos de cargar
    setIsLoading(false);
  };

  return (
    <Card className="mt-4" xs={12} lg={9}>
      {isLoading && <LoadingSpinner asOverlay />}
      {error && <AlertError error={error} />}
      <h3 className="text-center">¿Tienes una respuesta?</h3>
      <Formik
        initialValues={{
          text: "",
        }}
        validationSchema={validate}
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form className="my-4">
            <Input
              element="textarea"
              labelfloating="Puedes responder aquí"
              name="text"
              as="textarea"
              placeholder="Que pienses que pueda ayudar con la consulta"
            />
            <div className="text-center">
              <Button type="submit" className="rounded-pill" color="btn-submit">
                Responder
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default NewAnswerForm;
