import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";

import LicenseModel from "../models/license.model.js";

// Create License only Admin
export const addLicense = catchAsyncError(async (req, res, next) => {
  try {
    const { name, description, subjectId } = req.body;

    const newLicense = await LicenseModel.create({
      name,
      description,
      subjectId,
    });

    res.status(201).json({
      success: true,
      message: "New License is Created!",
      newLicense,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Get all Licenses by admin and user;
export const getAllLicense = catchAsyncError(async (req, res, next) => {
  try {
    const licenses = await LicenseModel.find().populate("subjectId");

    if (licenses.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No license found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Licenses are successfully retrieved",
      licenses,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Get all license for public
export const getAllLicenseOnPublic = catchAsyncError(async (req, res, next) => {
  try {
    const licenses = await LicenseModel.find().populate("subjectId");

    if (licenses.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No lincense found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Licenses are successfully retrieved",
      licenses,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// view License by ID
export const viewLicense = catchAsyncError(async (req, res, next) => {
  try {
    const licenseId = req?.params?.id;

    const license = await LicenseModel.findById(licenseId).populate(
      "subjectId"
    );

    if (!license) {
      return next(new ErrorHandler("No material found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Material successfully retrieved",
      license,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Update License only Admin
export const updateLicense = catchAsyncError(async (req, res, next) => {
  try {
    const licenseId = req.params.id;
    const { name, description, subjectId } = req.body;

    const updatedLicense = {
      name,
      description,
      subjectId,
    };

    const license = await LicenseModel.findByIdAndUpdate(
      licenseId,
      updatedLicense,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!license) {
      return next(new ErrorHandler("No license found", 404));
    }

    res.status(200).send({
      success: true,
      message: "License is successfully updated",
      license,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Delete License only Admin
export const deleteLicense = async (req, res, next) => {
  try {
    const licenseId = req.params.id;

    const license = await LicenseModel.findByIdAndDelete(licenseId);

    if (!license) {
      return next(new ErrorHandler("No license found", 404));
    }

    res.status(200).json({
      success: true,
      message: "License is successfully deleted",
      data: license,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};
