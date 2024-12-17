import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  licenseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "License",
  },
});

const SubjectModel = mongoose.model("Subject", subjectSchema);

export default SubjectModel;
