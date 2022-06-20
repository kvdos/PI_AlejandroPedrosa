const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const enquirySchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    answers: [{ type: mongoose.Types.ObjectId, required: true, ref: "Answer" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Enquiry", enquirySchema);
