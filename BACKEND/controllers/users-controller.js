const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const signup = async (req, res, next) => {
  // Guardamos en un objeto los errores de validación del request
  const errors = validationResult(req);
  // De haber errores, mostramos el error
  if (!errors.isEmpty()) {
    return next(new HttpError("Datos incorrectos", 422));
  }

  // Obtenemos los datos del usuario del body
  const { name, location, email, password } = req.body;
  // Comprobamos que no existe ya un usuario con el mismo email
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    // Paramos la ejecución en caso de error al obtener la información
    return next(new HttpError("Error al registrar nuevo usuario.", 500));
  }
  // Si ya existe el email, mostramos error
  if (existingUser) {
    return next(
      new HttpError(
        "Ya existe un usuario con la misma dirección de email.",
        401
      )
    );
  }

  // Encriptamos la contraseña recibida
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    // Paramos la ejecución en caso de error
    return next(
      new HttpError(
        "Error al registrar nuevo usuario, por favor, inténtalo de nuevo.",
        500
      )
    );
  }

  // Montamos el objeto el modelo creado para ello
  const createdUser = new User({
    name,
    location,
    email,
    password: hashedPassword,
    enquiries: [],
  });
  // Añadimos el nuevo usuario a la BBDD
  try {
    await createdUser.save();
  } catch (err) {
    // Paramos la ejecución en caso de error
    return next(
      new HttpError(
        "Error al registrar nuevo usuario, por favor, inténtalo de nuevo.",
        500
      )
    );
  }

  // Generamos el 'Token' con id, email y la clave
  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    // Paramos la ejecución en caso de error
    return next(
      new HttpError(
        "Error al registrar nuevo usuario, por favor, inténtalo de nuevo.",
        500
      )
    );
  }

  // Enviamos una respuesta con el id, otros datos del usuario y token generado
  res.status(201).json({
    userId: createdUser.id,
    userInfo: {
      name: createdUser.name,
      email: createdUser.email,
      location: createdUser.location,
    },
    token: token,
  });
};

const login = async (req, res, next) => {
  // Obtenemos del body las credenciales
  const { email, password } = req.body;
  // Comprobamos que existe en la BBDD
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    // Paramos la ejecución en caso de error al obtener la información
    return next(
      new HttpError(
        "Error al iniciar sesión, por favor, inténtalo de nuevo.",
        500
      )
    );
  }
  // Comprobamos si el usuario existe
  if (!existingUser) {
    // Paramos la ejecución en caso de ser incorrecto el email
    return next(new HttpError("No existe un usuario para este email", 403));
  }
  // Comprobamos si la contraseña coincide con la almacenada en la BBDD
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return next(
      new HttpError(
        "Error al iniciar sesión, por favor, inténtalo de nuevo.",
        500
      )
    );
  }
  // Si no coinciden las contraseñas, paramos la ejecución
  if (!isValidPassword) {
    return next(new HttpError("Contraseña incorrecta", 403));
  }

  // Generamos el 'Token' con id, email y la clave
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    // Paramos la ejecución en caso de error
    return next(
      new HttpError(
        "Error al iniciar sesión, por favor, inténtalo de nuevo.",
        500
      )
    );
  }

  // Si coinciden las contraseñas, enviamos respuesta con el id, otros datos del usuario y token
  res.json({
    userId: existingUser.id,
    userInfo: {
      name: existingUser.name,
      email: existingUser.email,
      location: existingUser.location,
    },
    token: token,
  });
};

// VALIDACIONES

const signupValidators = () => [
  // Validamos el nombre
  check("name")
    .notEmpty()
    .withMessage("Introduce un nombre de usuario")
    .isLength({ max: 15 })
    .withMessage("El nombre de usuario debe tener menos de 15 caracteres"),
  check("location")
    .notEmpty()
    .withMessage("Introduce un lugar de ubicación")
    .isLength({ max: 15 })
    .withMessage("El lugar del usuario debe tener menos de 15 caracteres"),
  // Validamos el email
  check("email").isEmail().normalizeEmail().withMessage("Email incorrecto"),
  // Validamos que la contraseña cumple ciertos requisitos
  check("password")
    .notEmpty()
    .withMessage("Introduce la contraseña")
    .isLength({ min: 8, max: 50 })
    .withMessage("La contraseña debe ser mayor a 8 caracteres")
    .matches(/^(?=.*[a-z])/)
    .withMessage("Debe contener al menos una minúscula")
    .matches(/^(?=.*[A-Z])/)
    .withMessage("Debe contener al menos una mayúscula")
    .matches(/^(?=.*[0-9])/)
    .withMessage("Debe contener al menos una número")
    .matches(/^(?=.*[!@#$%^&*])/)
    .withMessage("Debe contener al menos un caracter especial"),
  // Validamos que la contraseña de confirmación coincide
  check("confirmPassword")
    .notEmpty()
    .withMessage("Introduce de nuevo la contraseña")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Las contraseñas no coinciden"),
];

exports.signup = signup;
exports.login = login;
exports.signupValidators = signupValidators;
