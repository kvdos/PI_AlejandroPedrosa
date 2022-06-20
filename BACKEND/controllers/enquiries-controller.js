const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Enquiry = require("../models/enquiry");
const User = require("../models/user");
const Answer = require("../models/answer");

const getEnquiryById = async (req, res, next) => {
  // Obtenemos el id de la consulta de la URL
  const enquiryId = req.params.cid;
  // Usamos de forma asíncrona y id para encontrar la consulta almacenada en la BBDD con nuestro modelo y un método de mongoose
  let enquiry;
  try {
    enquiry = await Enquiry.findById(enquiryId);
  } catch (err) {
    // Paramos la ejecución en caso de error al obtener la información
    return next(new HttpError("Error al encontrar la consulta.", 500));
  }
  // Si no existe una consulta con dicho id, devolvemos un error, terminando aquí el método
  if (!enquiry) {
    return next(new HttpError("No existe ninguna consulta.", 404));
  }
  // De existir una consulta con dicho id, enviamos una respuesta tras haber transformado
  // el objeto de mongoose en uno de JavaScript y cambiar '_id' por 'id' en la BBDD con 'getters: true'
  res.json({ enquiry: enquiry.toObject({ getters: true }) });
};

const getEnquiriesByUserId = async (req, res, next) => {
  // Obtenemos de forma asíncrona con 'findById' de mongoose el usuario y compltamos las respuestas con 'populate'
  let user;
  try {
    // El userId lo obtenemos del 'token' almacenado en localStorage
    // Obtenemos con la query el documento del usuario y lo completamos con sus consultas
    user = await User.findById(req.userData.userId).populate("enquiries");
  } catch (err) {
    // Paramos la ejecución en caso de error al obtener la información
    return next(new HttpError("Error al encontrar las consultas", 500));
  }
  const enquiries = user.enquiries;
  // Si no existe ninguna consulta con el id del usuario, devolvemos un error
  if (!enquiries || enquiries.length === 0) {
    return next(new HttpError("No existe ninguna consulta", 404));
  }
  // De existir consultas, enviamos la respuesta tras transformar cada uno de los objetos mongoose
  // que componen el array en objeto de Javascript y añadir 'id'
  res
    .status(201)
    .json({ enquiries: enquiries.map((e) => e.toObject({ getters: true })) });
};

const getEnquiryAnswersById = async (req, res, next) => {
  // Obtenemos el id de la URL
  const enquiryId = req.params.cid;
  // Comprobamos si el usuario haciendo la petición es el propietario de la consulta
  const userToken = await User.findById(req.userData.userId);
  const userEnquiries = JSON.stringify(userToken.enquiries);
  if (!userEnquiries.includes(enquiryId)) {
    // Si el array del usuario no incluye el Id de la consulta, paramos la ejecución
    return next(
      new HttpError("No estás autorizado para obtener la consulta", 401)
    );
  }
  // Obtenemos de forma asíncrona y con 'find' de mongoose las respuestas con id de la consulta y le cargamos las respuestas
  let enquiry;
  let answers;
  try {
    enquiry = await Enquiry.findById(enquiryId).populate("answers");
    answers = enquiry.answers;
  } catch (err) {
    // Paramos la ejecución en caso de error al obtener la información
    return next(new HttpError("Error al encontrar la consulta", 500));
  }
  // Si no existe una consulta con dicho id, devolvemos un error, terminando aquí
  if (!enquiry) {
    return next(new HttpError("No existe ninguna consulta.", 404));
  } else if (!answers || answers.length === 0) {
    // De existir una consulta pero no tener respuestas, enviamos los datos de ésta
    res.status(201).json({ enquiry: enquiry.toObject({ getters: true }) });
  } else {
    // De existir respuestas, enviamos la respuesta tras transformar cada uno de los objetos mongoose
    // que componen el array en objeto de Javascript y añadir 'id'
    res.status(201).json({
      enquiry: enquiry.toObject({ getters: true }),
      answers: answers.map((e) => e.toObject({ getters: true })),
    });
  }
};

const createEnquiry = async (req, res, next) => {
  // Guardamos en un objeto los errores de validación del request
  const errors = validationResult(req);
  // De haber errores, mostramos el error
  if (!errors.isEmpty()) {
    return next(new HttpError("Título o consulta incorrectos", 422));
  }

  // Comprobamos si el user id existe para, entonces, crear la nueva consulta
  let user;
  try {
    // Obtenemos el id del usuario del 'token' almacenado
    user = await User.findById(req.userData.userId);
  } catch (err) {
    // Paramos la ejecución en caso de error
    return next(
      new HttpError(
        "Error al crear la consulta, por favor, inténtalo de nuevo.",
        500
      )
    );
  }
  // Si el usuario no existe, mostramos un error
  if (!user) {
    return next(new HttpError("Error al identificar el usuario.", 404));
  }

  // Para post request, encontramos en el body los datos con los que crear una nueva consulta
  const { title, description, location } = req.body;
  // Usamos el esquema definido
  const createdEnquiry = new Enquiry({
    title,
    description,
    location,
  });

  // Si existe el usuario, añadimos la colección a la BBDD con session y transaction
  // para asegurarnos de que solo modificamos los documentos si todo ha funcionado
  try {
    // PRIMERO creamos el nuevo documento con la nueva consulta
    // Iniciamos sesión para trabajar de forma aislada con transaction
    const sess = await mongoose.startSession();
    sess.startTransaction();
    // Guardamos la consulta con save() como parte de la sesión
    await createdEnquiry.save({ session: sess });
    // SEGUNDO añadimos el id de la consulta en el documento de usuario
    // Con método mongoose 'push' añadimos el id de consulta al usuario y establecemos conexión entre modelos
    user.enquiries.push(createdEnquiry);
    // Actualizamos el usuario con save() sin validar de nuevo el id
    await user.save({ session: sess, validateModifiedOnly: true });
    // Una vez realizado exitosamente todo lo anterior, hacemos commit de la transaction
    await sess.commitTransaction();
  } catch (err) {
    // Paramos la ejecución en caso de error
    return next(
      new HttpError(
        "Error al crear la consulta, por favor, inténtalo de nuevo.",
        500
      )
    );
  }
  // Enviamos una respuesta
  res.status(201).json({ enquiry: createdEnquiry });
};

const updateEnquiry = async (req, res, next) => {
  // Obtenemos el id de la URL
  const enquiryId = req.params.cid;

  // Comprobamos si el usuario haciendo la petición es el propietario de la consulta
  const userToken = await User.findById(req.userData.userId);
  const userEnquiries = JSON.stringify(userToken.enquiries);
  if (!userEnquiries.includes(enquiryId)) {
    // Si el array del usuario no incluye el Id de la consulta, paramos la ejecución
    return next(
      new HttpError("No estás autorizado para modificar la consulta", 401)
    );
  }

  // Guardamos en un objeto los errores de validación del request
  const errors = validationResult(req);
  // De haber errores, mostramos el error
  if (!errors.isEmpty()) {
    return next(new HttpError("Título o consulta incorrectos", 422));
  }

  // Para patch request, encontramos en el body los datos a actualizar, title y description
  const { title, description } = req.body;

  // Buscamos en BBDD la consulta con dicho id además del usuario para mejorar la seguridad
  let enquiry;
  try {
    enquiry = await Enquiry.findById(enquiryId);
  } catch (err) {
    // Paramos la ejecución en caso de error
    return next(new HttpError("Error al actualizar la consulta", 500));
  }

  // Actualizamos la consulta con los campos modificados
  enquiry.title = title;
  enquiry.description = description;
  // Actualizamos con el método de mongoose 'save' para guardar la nueva información
  try {
    await enquiry.save();
  } catch (err) {
    // Paramos la ejecución en caso de error
    return next(new HttpError("Error al actualizar la consulta", 500));
  }
  // Enviamos una respuesta tras haber transformado el objeto de mongoose en uno de
  // JavaScript y cambiar '_id' por 'id' en la BBDD con 'getters: true'
  res.status(200).json({ enquiry: enquiry.toObject({ getters: true }) });
};

const deleteEnquiry = async (req, res, next) => {
  // Guardamos el id de la consulta a eliminar
  const enquiryId = req.params.cid;

  // Comprobamos si el usuario haciendo la petición es el propietario de la consulta
  const userId = req.userData.userId; // Id recibido en headers para verificar
  const userToken = await User.findById(userId);
  const userEnquiries = JSON.stringify(userToken.enquiries);
  if (!userEnquiries.includes(enquiryId)) {
    // Si el array del usuario no incluye el Id de la consulta, paramos la ejecución
    return next(
      new HttpError("No estás autorizado para eliminar la consulta", 401)
    );
  }

  // Para eliminar la consulta, también debemos eliminarla del documento de 'user' con populate()
  let enquiry;
  let user;
  try {
    // Guardamos los documentos de consulta identificados por sus id
    enquiry = await Enquiry.findById(enquiryId);
    user = await User.findById(userId);
  } catch (err) {
    // Paramos la ejecución en caso de error
    return next(new HttpError("Error al intentar eliminar la consulta", 500));
  }
  // Comprobamos si la consulta existe antes de eliminarla de los documentos
  if (!enquiry) {
    return next(new HttpError("No existe la consulta", 404));
  }

  // Obtenemos el array de referencias de las respuestas de la consulta
  const references = enquiry.answers;
  // Definimos la condición para borrar las respuestas
  const deleteCondition = {
    _id: {
      $in: references,
    },
  };

  // Si existe la consulta, continuamos eliminándola
  try {
    // Iniciamos sesión para trabajar con transaction
    const sess = await mongoose.startSession();
    sess.startTransaction();
    // Eliminamos los documentos de respuestas referenciados
    await Answer.deleteMany(deleteCondition, { session: sess });
    // Entonces borramos la consulta de la colección en cuestión refiriéndonos a la sesión actual
    await enquiry.remove({ session: sess });
    // Ahora eliminamos con pull() la referencia de la consulta en el usuario
    user.enquiries.pull(enquiry);
    // Ya con la consulta eliminada del usuario, guardamos el 'nuevo' usuario
    await user.save({ session: sess });
    // Una vez realizado exitosamente todo lo anterior, hacemos commit de la transaction
    await sess.commitTransaction();
  } catch (err) {
    // Paramos la ejecución en caso de error
    return next(new HttpError("Error al intentar eliminar la consulta.", 500));
  }
  // Enviamos una respuesta
  res.status(200).json({ message: "Consulta eliminada." });
};

// VALIDACIONES
const createEnquiryValidators = () => [
  check("title")
    .notEmpty()
    .withMessage("Introduce un título")
    .isLength({ min: 4, max: 85 })
    .withMessage("El título debe tener entre 4 y 85 caracteres"),
  check("description")
    .notEmpty()
    .withMessage("Introduce la descripción")
    .isLength({ min: 60 })
    .withMessage("La descripción debe superar los 60 caracteres")
    .isLength({ max: 5000 })
    .withMessage("Has superado el máximo de 5000 caracteres"),
];

const updateEnquiryValidators = () => [
  check("title")
    .notEmpty()
    .withMessage("Introduce un título")
    .isLength({ min: 4, max: 85 })
    .withMessage("El título debe tener entre 4 y 85 caracteres"),
  check("description")
    .notEmpty()
    .withMessage("Introduce la descripción")
    .isLength({ min: 60 })
    .withMessage("La descripción debe superar los 60 caracteres")
    .isLength({ max: 5000 })
    .withMessage("Has superado el máximo de 5000 caracteres"),
];

exports.getEnquiryById = getEnquiryById;
exports.getEnquiriesByUserId = getEnquiriesByUserId;
exports.getEnquiryAnswersById = getEnquiryAnswersById;
exports.createEnquiry = createEnquiry;
exports.updateEnquiry = updateEnquiry;
exports.deleteEnquiry = deleteEnquiry;
exports.createEnquiryValidators = createEnquiryValidators;
exports.updateEnquiryValidators = updateEnquiryValidators;
