const express = require("express");
const router = express.Router();

const answersControllers = require("../controllers/answers-controller");
const checkAuth = require("../middleware/check-auth");

router.post(
  "/",
  answersControllers.createAnswerValidators(),
  answersControllers.createAnswer
);

// Añadimos un middleware para proteger las peticiones que le siguen
router.use(checkAuth);

// Estas peticiones necesitarán el 'token' para realizarse
router.patch("/:aid", answersControllers.updateAnswer);

router.delete("/:aid", answersControllers.deleteAnswer);

module.exports = router;
