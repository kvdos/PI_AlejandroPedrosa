import styles from "./EnquiryList.module.css";
import EnquiryItem from "./EnquiryItem";
import { logTime } from "../../shared/util/logTime";

const EnquiryList = (props) => {
  // De tener consultas, las ordenamos por fecha de última modificación
  const items = props.items.sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  // Comprobamos si la consulta ha sido actualizada para señalarlo en EnquiryItem
  const onChange = (updatedAt) => {
    const logged = logTime();
    if (logged && new Date(updatedAt) > logged) {
      return true;
    }
    return false;
  };

  // Y las mostramos en listado
  return (
    <ul className="list-unstyled">
      <h1 className="text-center mb-3 color-defecto">Mis consultas</h1>
      {items.map((enquiry) => (
        <li key={enquiry.id} className={`${styles.box} mb-2 rounded`}>
          <EnquiryItem
            id={enquiry.id}
            title={enquiry.title}
            change={onChange(enquiry.updatedAt)}
          />
        </li>
      ))}
    </ul>
  );
};

export default EnquiryList;
