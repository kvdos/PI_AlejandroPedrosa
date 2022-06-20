import Alert from "./Alert";

const AlertSuccess = (props) => {
  return <Alert type="success" body={props.message} />;
};

export default AlertSuccess;
