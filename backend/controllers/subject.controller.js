import SubjectModel from "../models/subject.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";

// Create License only Admin
export const addSubject = catchAsyncError(async (req, res, next) => {
  try {
    const { name, description, licenseId } = req.body;

    const newSubject = new SubjectModel({
      name,
      description,
      licenseId,
    });

    await newSubject.save();

    res.status(201).json({
      success: true,
      message: "New Subject is Created!",
      newSubject,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Get all Subjects by admin and user;
export const getAllSubject = catchAsyncError(async (req, res, next) => {
  try {
    const subjects = await SubjectModel.find().populate("licenseId");

    if (subjects.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No subjects found",
        subjects,
      });
    }

    res.status(200).json({
      success: true,
      message: "Subjects are successfully retrieved",
      subjects,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Get all license for public
export const getAllSubjectOnPublic = catchAsyncError(async (req, res, next) => {
  try {
    const subjects = await SubjectModel.find().populate("licenseId");

    if (subjects.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No subjects found",
        subjects,
      });
    }

    res.status(200).json({
      success: true,
      message: "Subjects are successfully retrieved",
      subjects,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Update Subject only Admin
export const updateSubject = catchAsyncError(async (req, res, next) => {
  try {
    const subjectId = req.params.id;
    const { name, description } = req.body;

    const updatedSubject = {
      name,
      description,
    };

    const subject = await SubjectModel.findByIdAndUpdate(
      subjectId,
      updatedSubject,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!subject) {
      return next(new ErrorHandler("No subject found", 404));
    }

    res.status(200).send({
      success: true,
      message: "Subject is successfully updated",
      subject,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Delete Subject only Admin
export const deleteSubject = catchAsyncError(async (req, res, next) => {
  try {
    const subjectId = req.params.id;

    const subject = await SubjectModel.findByIdAndDelete(subjectId);

    if (!subject) {
      return next(new ErrorHandler("No subject found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Subject is successfully deleted",
      subject,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 404));
  }
});
