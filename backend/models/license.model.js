import mongoose from "mongoose";

const licenseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  subjectId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
  ],
});

const LicenseModel = mongoose.model("License", licenseSchema);

export default LicenseModel;
