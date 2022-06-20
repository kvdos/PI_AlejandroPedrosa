const express = require("express");
const router = express.Router();

const enquiriesControllers = require("../controllers/enquiries-controller");
const checkAuth = require("../middleware/check-auth");

router.get("/shared/:cid", enquiriesControllers.getEnquiryById);

// Añadimos un middleware para proteger las peticiones que le siguen
router.use(checkAuth);

// Estas peticiones necesitarán el 'token' para realizarse
router.get("/", enquiriesControllers.getEnquiriesByUserId);

router.get("/:cid", enquiriesControllers.getEnquiryAnswersById);

router.post(
  "/",
  enquiriesControllers.createEnquiryValidators(),
  enquiriesControllers.createEnquiry
);

router.patch(
  "/:cid",
  enquiriesControllers.updateEnquiryValidators(),
  enquiriesControllers.updateEnquiry
);

router.delete("/:cid", enquiriesControllers.deleteEnquiry);

module.exports = router;
