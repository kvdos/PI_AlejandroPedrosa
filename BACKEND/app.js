const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const enquiriesRoutes = require("./routes/enquiries-routes");
const answersRoutes = require("./routes/answers-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

// Fijamos con un middleware los siguientes headers a nuestras respuesta para saltarnos CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  // Con next() continuamos con el envío de las peticiones a cada ruta
  next();
});

app.use("/api/consultas", enquiriesRoutes);
app.use("/api/respuestas", answersRoutes);
app.use("/api/usuarios", usersRoutes);

// Handling errors for unsupported routes
app.use((req, res, next) => {
  const error = new HttpError("No hemos encontrado la página.", 404);
  throw error;
});

// Error handling
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "Ha ocurrido un error." });
});

// Conectamos a la BBDD
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lu3ls.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  // De conectar con la BBDD con éxito, iniciamos el servicio
  .then(() => app.listen(process.env.PORT || 5001))
  // Si no, mostramos por consola el error
  .catch((err) => console.log(err));
