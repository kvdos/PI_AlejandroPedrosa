import styles from "./SignupForm.module.css";
import { useContext, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Button from "../../../shared/components/UI/Button";
import logo from "../../../Assets/Images/logo-purple.png";
import registro from "../../../Assets/Images/registro.jpg";
import Input from "../../../shared/components/FormElements/Input";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../../../shared/components/UI/LoadingSpinner";
import { AuthContext } from "../../../shared/context/auth-context";
import Helmet from "react-helmet";
import AlertError from "../../../shared/components/UI/AlertError";

const SignupForm = () => {
  // Accedemos a nuestro objecto context para gestionar el logeado del usuario
  const auth = useContext(AuthContext);

  // States para gestionar la espera de la respuesta y los errores
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();

  // Validaciones
  const validate = Yup.object({
    name: Yup.string()
      .max(15, "El nombre no puede superar los 15 caracteres")
      .required("Introduce tu nombre de usuario"),
    location: Yup.string()
      .max(
        15,
        "El nombre de tu localización no puede superar los 15 caracteres"
      )
      .required("Introduce tu localización"),
    email: Yup.string()
      .email("Correo no válido")
      .required("Introduce tu correo"),
    password: Yup.string()
      .min(8, "La contraseña debe ser mayor a 8 caracteres")
      .matches(/^(?=.*[a-z])/, "Debe contener al menos una minúscula")
      .matches(/^(?=.*[A-Z])/, "Debe contener al menos una mayúscula")
      .matches(/^(?=.*[0-9])/, "Debe contener al menos un número")
      .matches(
        /^(?=.*[!@#$%^&*])/,
        "Debe contener al menos un caracter especial"
      )
      .required("Introduce la contraseña"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden")
      .required("Introduce de nuevo la contraseña"),
  });

  // Función que se ejecuta al hacer submit en el formulario
  const onSubmit = async (values, { resetForm, setFieldError }) => {
    // Al hacer submit, reseteamos el estado del error
    setError(null);
    // Establecemos que estamos esperando la respuesta
    setIsLoading(true);
    // Hacemos la petición
    await axios
      .post(process.env.REACT_APP_BACKEND_URL + "/usuarios/signup", values)
      .then((response) => {
        // Llamamos a la función 'login()' de nuestro contexto, actualizándolo
        // así como la interfaz.
        auth.login(
          response.data.userId,
          response.data.userInfo,
          response.data.token
        );
        // Reseteamos el formulario
        resetForm();
      })
      .catch((err) => {
        // En caso de existir un error, lo almacenamos en el status 'error'
        setError(err);
        // De existir el email, fijamos el mensaje de error como validación
        if (err.response.status === 401) {
          setFieldError("email", err.response.data.message);
        }
      });
    // Independientemente de si hay respuesta o error, terminamos de cargar
    setIsLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Regístrate</title>
        <meta
          name="description"
          content="Regístrate y recibe esa información que necesitas."
        />
      </Helmet>
      <Container className={styles.input}>
        {isLoading && <LoadingSpinner asOverlay />}
        {error && error.response.status !== 401 && <AlertError error={error} />}
        <Row className="py-4 justify-content-evenly">
          <Col xs={12} md={6} lg={5} className="order-2 order-lg-1">
            <Formik
              initialValues={{
                name: "",
                location: "",
                email: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={validate}
              // Establecemos la petición de http de forma asíncrona al hacer submit
              onSubmit={onSubmit}
            >
              {(formik) => (
                <Form className="row mt-2">
                  <Input
                    element="input"
                    label="Nombre de usuario"
                    name="name"
                    type="text"
                    placeholder="Que otros podrán ver"
                  />
                  <Input
                    element="input"
                    label="Lugar"
                    name="location"
                    type="text"
                    placeholder="Para recibir recomendaciones más locales"
                  />
                  <Input
                    element="input"
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Correo electrónico"
                  />
                  <Input
                    element="input"
                    label="Contraseña"
                    name="password"
                    type="password"
                    placeholder="Contraseña"
                  />

                  <Input
                    element="input"
                    label="Repite la contraseña"
                    name="confirmPassword"
                    type="password"
                    placeholder="Contraseña"
                  />
                  <div className="px-3 w-100 d-flex px-sm-0">
                    <Button
                      type="submit"
                      className="rounded-pill mx-auto mt-2"
                      color="btn-extra"
                    >
                      Registrarme
                    </Button>
                  </div>
                  <Link
                    to="/login"
                    className="text-center text-decoration-none mt-3 fs-6"
                  >
                    Ya tengo una cuenta
                  </Link>
                </Form>
              )}
            </Formik>
          </Col>
          <Col lg={6} className="order-1 order-lg-2 d-flex">
            <div className="text-center w-100 my-auto">
              <img
                src={logo}
                width="120"
                className="align-top mb-3 d-none d-lg-inline-block"
                alt="logo"
              />
              <h3 className="text-center mb-lg-3">
                Regístrate y empieza a obtener respuesta a tus preguntas.
              </h3>
              <img
                src={registro}
                width="50%"
                className="align-top d-none d-lg-inline-block"
                alt="logo"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SignupForm;
