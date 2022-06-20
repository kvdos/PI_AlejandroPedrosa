import styles from "./Input.module.css";
import { Form, FloatingLabel } from "react-bootstrap";
import useTextarea from "../../hooks/use-textarea";
import { useField, ErrorMessage } from "formik";

// min height textarea
const MIN_TEXTAREA_HEIGHT = 100;

const Input = (props) => {
  const [field, meta] = useField(props);

  // Obtenemos el ref del textarea en caso de tener uno
  const { textareaRef } = useTextarea(MIN_TEXTAREA_HEIGHT, field.value);

  // Si en el formulario especificamos un textarea, le añadimos las propiedades correspondientes
  let inputProperties = {};
  if (props.element === "textarea") {
    inputProperties = {
      ref: textareaRef,
      style: {
        minHeight: MIN_TEXTAREA_HEIGHT,
        resize: "none",
      },
    };
  }

  const input = (
    <>
      <Form.Control
        {...field}
        {...props}
        {...inputProperties}
        className={`shadow-none ${
          meta.touched && meta.error && `is-invalid ${styles["bg-invalid"]}`
        }`}
      />
      <ErrorMessage
        name={field.name}
        component="div"
        className="ps-2 invalid-feedback"
      />
    </>
  );

  return props.label ? (
    <Form.Group className={`${styles.input} mb-2 mb-sm-3`}>
      <Form.Label className="fw-bold">{props.label}</Form.Label>
      {input}
    </Form.Group>
  ) : (
    <FloatingLabel
      label={props.labelfloating}
      className={`${styles.input} mb-3`}
    >
      {input}
    </FloatingLabel>
  );
};

export default Input;
