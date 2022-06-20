import AnswerItem from "./AnswerItem";

const AnswerList = (props) => {
  // Comprobamos si tenemos respuestas en el array que recibimos
  if (props.items.length === 0) {
    // De no tener, lo avisamos
    return (
      <div className="text-center py-5">
        <p className="m-0">
          {props.favList
            ? "No tienes favoritos para esta consulta"
            : "No tienes respuestas. ¡Comparte la consulta!"}
        </p>
      </div>
    );
  }

  // De tener respuestas, las ordenamos por fecha de última modificación
  const items = props.items.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Y las mostramos en listado
  return (
    <>
      {items.map((answer, index, array) => (
        <li
          key={answer.id}
          className={array.length - 1 > index ? "border-bottom" : ""}
        >
          <AnswerItem
            id={answer.id}
            text={answer.text}
            favourite={answer.favourite}
            createdAt={answer.createdAt}
            updatedAt={answer.updatedAt}
            onDelete={props.onDeleteAnswer}
            onUpdate={props.onUpdateAnswers}
          />
        </li>
      ))}
    </>
  );
};

export default AnswerList;
