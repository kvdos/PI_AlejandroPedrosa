import styles from "./LoginForm.module.css";
import { useContext, useState } from "react";
import Button from "../../../shared/components/UI/Button";
import logo from "../../../Assets/Images/logo-purple.png";
import Input from "../../../shared/components/FormElements/Input";
import { Container, Row, Col } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import LoadingSpinner from "../../../shared/components/UI/LoadingSpinner";
import { AuthContext } from "../../../shared/context/auth-context";
import { useNavigate } from "react-router-dom";
import Helmet from "react-helmet";
import AlertError from "../../../shared/components/UI/AlertError";

const LoginForm = () => {
  // Accedemos a nuestro objecto context para gestionar el logeado del usuario
  const auth = useContext(AuthContext);

  // States para gestionar la espera de la respuesta y los errores
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();
  // Uso de hook para redirigir
  const navigate = useNavigate();

  // Validaciones
  const validate = Yup.object({
    email: Yup.string()
      .email("Correo no válido")
      .required("Introduce tu correo"),
    password: Yup.string().required("Introduce tu contraseña"),
  });

  // Función que se ejecuta al hacer submit en el formulario
  const onSubmit = async (values, { setFieldError }) => {
    // Al hacer submit, reseteamos el estado del error
    setError(null);
    // Establecemos que estamos esperando la respuesta
    setIsLoading(true);
    // Hacemos la petición
    await axios
      .post(process.env.REACT_APP_BACKEND_URL + "/usuarios/login", values)
      .then((response) => {
        // Llamamos a la función 'login()' de nuestro contexto, actualizándolo
        // así como la interfaz. Pasamos también el 'token'
        auth.login(
          response.data.userId,
          response.data.userInfo,
          response.data.token
        );
      })
      .catch((err) => {
        // En caso de existir un error, lo almacenamos en el status 'error'
        setError(err);
        // De no haber email o contraseña en la BBDD fijamos el mensaje de error como validación
        if (err.response.status === 403) {
          const msg = err.response.data.message;
          if (msg.includes("email")) {
            setFieldError(Object.keys(values)[0], err.response.data.message);
          } else {
            setFieldError(Object.keys(values)[1], err.response.data.message);
          }
        }
      });
    // Independientemente de si hay respuesta o error, terminamos de cargar
    setIsLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Login</title>
        <meta
          name="description"
          content="Inicia sesión con tu cuenta para consultar y ver las respuestas."
        />
      </Helmet>
      <Container className={`${styles["height-full"]} d-lg-flex`}>
        {isLoading && <LoadingSpinner asOverlay />}
        {error && error.response.status !== 403 && <AlertError error={error} />}
        <Row className="py-4 justify-content-evenly">
          <Col xs={12} md={6} lg={5} className="order-2 order-lg-2">
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={validate}
              // Establecemos la petición de http de forma asíncrona al hacer submit
              onSubmit={onSubmit}
            >
              {(formik) => (
                <div className={styles["height-100"]}>
                  <div className="my-4 my-lg-auto w-100 p-4 rounded-sm-3 bg-white">
                    <Form>
                      <Input
                        element="input"
                        labelfloating="Email"
                        name="email"
                        type="email"
                        placeholder="email"
                      />
                      <Input
                        element="input"
                        labelfloating="Contraseña"
                        name="password"
                        type="password"
                        placeholder="password"
                      />
                      <div className="text-center">
                        <Button type="submit" color="btn-submit">
                          Iniciar sesión
                        </Button>
                      </div>
                    </Form>
                    <hr />
                    <div className="text-center">
                      <p>¿No tienes cuenta? ¡Regístrate!</p>
                      <Button
                        color="btn-extra"
                        onClick={() => navigate("/signup")}
                      >
                        Registrarme
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Formik>
          </Col>
          <Col lg={6} className="order-1 order-lg-1 d-flex">
            <div className="text-center w-100 my-auto">
              <img
                src={logo}
                width="120"
                className="align-top mb-3 d-none d-lg-inline-block"
                alt="logo"
              />
              <h3 className="text-center mb-lg-3">
                Diskoza te ayuda a encontrar esa información que necesitas.
              </h3>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LoginForm;
