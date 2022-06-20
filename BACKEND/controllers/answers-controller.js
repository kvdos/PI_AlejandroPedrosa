const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Answer = require("../models/answer");
const Enquiry = require("../models/enquiry");

const createAnswer = async (req, res, next) => {
  // Guardamos en un objeto los errores de validación del request
  const errors = validationResult(req);
  // De haber errores, mostramos el error
  if (!errors.isEmpty()) {
    return next(new HttpError("Respuesta incorrecta", 422));
  }
  // Para post request, encontramos en el body los datos con los que crear una nueva respuesta
  const { text, enquiryId } = req.body;
  // Usamos el esquema definido
  const createdAnswer = new Answer({
    text,
    favourite: false,
  });
  // Comprobamos si el enquiry id existe para, entonces, crear la nueva respuesta
  let enquiry;
  try {
    enquiry = await Enquiry.findById(enquiryId);
  } catch (err) {
    // Paramos la ejecución en caso de error
    return next(
      new HttpError(
        "Error al crear la respuesta, por favor, inténtalo de nuevo.",
        500
      )
    );
  }
  // Si la consulta no existe, mostramos un error
  if (!enquiry) {
    return next(new HttpError("Error al identificar la consulta.", 404));
  }
  // Si existe la consulta, añadimos la colección a la BBDD con session y transaction
  // para asegurarnos de que solo modificamos los documentos si todo ha funcionado
  try {
    // PRIMERO creamos el nuevo documento con la nueva respuesta
    // Iniciamos sesión para trabajar de forma aislada con transaction
    const sess = await mongoose.startSession();
    sess.startTransaction();
    // Guardamos la respuesta con save() como parte de la sesión
    await createdAnswer.save({ session: sess });
    // SEGUNDO añadimos el id de la respuesta en el documento de usuario
    // Con método mongoose 'push' añadimos el id de respuesta al usuario y establecemos conexión entre modelos
    enquiry.answers.push(createdAnswer);
    // Actualizamos la consulta con save() sin validar de nuevo el id
    await enquiry.save({ session: sess, validateModifiedOnly: true });
    // Una vez realizado exitosamente todo lo anterior, hacemos commit de la transaction
    await sess.commitTransaction();
  } catch (err) {
    // Paramos la ejecución en caso de error
    return next(
      new HttpError(
        "Error al crear la respuesta, por favor, inténtalo de nuevo.",
        500
      )
    );
  }
  // Enviamos una respuesta
  res.status(201).json({ answer: createdAnswer });
};

const updateAnswer = async (req, res, next) => {
  // Para patch request, encontramos en el body los datos a actualizar (favourite)
  const { favourite } = req.body;
  // Guardamos el id de la respuesta y que encontramos en la URL
  const answerId = req.params.aid;
  // Buscamos en BBDD la respuesta con dicho id
  let answer;
  try {
    answer = await Answer.findById(answerId);
  } catch (err) {
    // Paramos la ejecución en caso de error
    return next(new HttpError("Error al actualizar la respuesta", 500));
  }
  // Actualizamos la respuesta con los campos modificados
  answer.favourite = favourite;
  // Actualizamos con el método de mongoose 'save' para guardar la nueva información
  try {
    await answer.save();
  } catch (err) {
    // Paramos la ejecución en caso de error
    return next(new HttpError("Error al actualizar la respuesta", 500));
  }
  // Enviamos una respuesta tras haber transformado el objeto de mongoose en uno de
  // JavaScript y cambiar '_id' por 'id' en la BBDD con 'getters: true'
  res.status(200).json({ answer: answer.toObject({ getters: true }) });
};

const deleteAnswer = async (req, res, next) => {
  // Guardamos el id de la respuesta a eliminar
  const answerId = req.params.aid;
  // Para eliminar la respuesta, también debemos eliminarla del documento de 'enquiry' con populate()
  let answer;
  let enquiry;
  try {
    // Guardamos la respuesta identificada por su 'id' así como el documento de consulta que la referencia
    answer = await Answer.findById(answerId);
    enquiry = await Enquiry.findOne({ enquiries: answerId });
  } catch (err) {
    // Paramos la ejecución en caso de error
    return next(new HttpError("Error al intentar eliminar la respuesta", 500));
  }
  // Comprobamos si la respuesta existe antes de eliminarla de los documentos
  if (!answer) {
    return next(new HttpError("No existe la respuesta", 404));
  }
  // Si existe la respuesta, continuamos eliminándola
  try {
    // Iniciamos sesión para trabajar con transaction
    const sess = await mongoose.startSession();
    sess.startTransaction();
    // Entonces borramos la respuesta de la colección refiriéndonos a la sesión actual
    await answer.remove({ session: sess });
    // Ahora eliminamos con pull() la referencia de la respuesta en la consulta
    enquiry.answers.pull(answer);
    // Ya con la respuesta eliminada de la consulta, guardamos la nueva consulta
    await enquiry.save({ session: sess });
    // Una vez realizado exitosamente todo lo anterior, hacemos commit de la transaction
    await sess.commitTransaction();
  } catch (err) {
    // Paramos la ejecución en caso de error
    return next(new HttpError("Error al intentar eliminar la respuesta", 500));
  }
  // Enviamos una respuesta
  res
    .status(200)
    .json({ message: "La respuesta ha sido eliminada correctamente." });
};

// VALIDACIONES

const createAnswerValidators = () => [
  check("text")
    .notEmpty()
    .withMessage("Introduce la descripción")
    .isLength({ max: 5000 })
    .withMessage("Has superado el máximo de 5000 caracteres"),
];

const updateAnswerValidators = () => [
  check("text")
    .notEmpty()
    .withMessage("Introduce la descripción")
    .isLength({ max: 5000 })
    .withMessage("Has superado el máximo de 5000 caracteres"),
];

exports.createAnswer = createAnswer;
exports.updateAnswer = updateAnswer;
exports.deleteAnswer = deleteAnswer;
exports.createAnswerValidators = createAnswerValidators;
exports.updateAnswerValidators = updateAnswerValidators;
