const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8 },
  enquiries: [
    { type: mongoose.Types.ObjectId, required: true, ref: "Enquiry" },
  ],
});
// Nos aseguramos que solo se puede crear un usuario por correo
userSchema.plugin(uniqueValidator);
// Exportamos el modelo para usuario
module.exports = mongoose.model("User", userSchema);
