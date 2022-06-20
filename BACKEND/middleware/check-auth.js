const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  // Antes de extraer el 'token', permitimos otras peticiones a parte de 'get'
  if (req.method === "OPTIONS") {
    return next();
  }
  // Extraemos el 'token' del 'headers' de la petición recibida
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      // Si el 'token' es inválido, detenemos la ejecución
      throw new Error("Error en la autenticación.");
    }
    // Verificamos el 'token' con la private key usada en 'users-controllers'
    // Obtenemos el objeto que forma el 'token'
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    // Añadimos el id del usuario a la petición, de forma que cualquier petición
    // que se dé luego podrá usarlo
    req.userData = { userId: decodedToken.userId };
    // De verificarse, continuamos con la ejecución
    next();
  } catch (err) {
    return next(new HttpError("Error en la autenticación.", 403));
  }
};
