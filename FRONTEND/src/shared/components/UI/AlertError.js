import Alert from "./Alert";

const AlertError = (props) => {
  // Si el error tiene una respuesta, lo almacenamos
  const error = props.error && props.response ? props.error : null;

  // De haber respuesta, la mostramos en el mensaje
  const alert = error ? (
    <Alert type="danger" body={error.response.data.message} />
  ) : (
    // Si no, mostramos un mensaje genérico
    <Alert
      type="danger"
      body={"Se ha producido un error, vuelve a intentarlo más tarde."}
    />
  );

  return alert;
};

export default AlertError;
