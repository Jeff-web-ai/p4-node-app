import cloudinary from "cloudinary";
import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import MaterialModel from "../models/material.model.js";
import UserModel from "../models/user.model.js";

// upload material by examinee
export const addMaterial = catchAsyncError(async (req, res, next) => {
  try {
    const currentUser = await UserModel.findById(req.user._id);
    const { title, description, subjectId } = req.body;

    // Validate file types
    const acceptedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
    for (const file of req.files) {
      if (!acceptedMimeTypes.includes(file.mimetype)) {
        return next(
          new ErrorHandler("Only images (JPEG/PNG) and PDFs are allowed.", 400)
        );
      }
    }

    let materialFilesOnCloud = [];

    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          { folder: "Materials" },
          (error, result) => {
            if (error) reject(new ErrorHandler("File upload failed", 500));
            else resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });

      materialFilesOnCloud.push({
        public_id: result.public_id,
        url: result.secure_url,
        fileName: result.original_filename,
        fileSize: result.bytes,
      });
    }

    const material = await MaterialModel.create({
      title,
      description,
      files: materialFilesOnCloud,
      uploadedBy: currentUser._id,
      licenseId: currentUser.licenseId,
      subjectId,
    });

    res.status(201).json({
      success: true,
      message: "New material added successfully",
      material,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// get User updload
export const getMaterialsByUser = catchAsyncError(async (req, res, next) => {
  try {
    const examineeId = req?.user?._id;

    if (!examineeId) return next(new ErrorHandler("Invalid user ID", 400));

    const examinee = await UserModel.findById(examineeId);

    if (examinee.role !== "examinee") {
      return next(
        new ErrorHandler(
          `${examinee.role} role is not allowed to access this resource`
        )
      );
    }

    const materials = await MaterialModel.find({ uploadedBy: examinee._id });

    res.status(200).json({
      success: true,
      materials,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Get user favorites
export const getUserFavorites = catchAsyncError(async (req, res, next) => {
  try {
    const examineeId = req?.user?._id;

    if (!examineeId) return next(new ErrorHandler("Invalid user ID", 400));

    const currentUser = await UserModel.findById(examineeId);

    if (currentUser.role === "admin") {
      return next(
        new ErrorHandler(
          `${currentUser.role} role is not allowed to access to resource`
        )
      );
    }

    const userFavorites = await UserModel.find({
      _id: currentUser._id,
    }).populate("favoriteId");

    res.status(200).json({
      success: true,
      message: "The user's favorite(s)",
      userFavorites,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// get materials by license
export const getAllMaterials = catchAsyncError(async (req, res, next) => {
  try {
    const examineeId = req?.user?._id;

    if (!examineeId) return next(new ErrorHandler("Invalid user ID", 400));

    const examinee = await UserModel.findById(examineeId).sort({
      createdAt: -1,
    });

    if (examinee.role !== "examinee") {
      return next(
        new ErrorHandler(
          `${examinee.role} role is not allowed to access this resource`
        )
      );
    }

    const materials = await MaterialModel.find({
      licenseId: examinee.licenseId,
    })
      .populate("licenseId")
      .populate("subjectId")
      .populate("uploadedBy")
      .sort({ createdAt: -1 });

    if (materials.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No materials found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Materials successfully retrieved",
      materials,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// get all materials
export const getAllMaterialsOnPublic = catchAsyncError(
  async (req, res, next) => {
    try {
      const materials = await MaterialModel.find()
        .populate("licenseId")
        .populate("subjectId")
        .populate("uploadedBy");

      if (materials.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No materials found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Materials successfully retrieved",
        materials,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// add materials on user favorites
export const addMaterialUserFavorites = catchAsyncError(
  async (req, res, next) => {
    try {
      const materialId = req.params.id;

      const examineeId = req?.user?._id;
      if (!examineeId) return next(new ErrorHandler("Invalid user ID", 400));

      const currentUser = await UserModel.findById(examineeId);
      if (currentUser === "admin") {
        return next(
          new ErrorHandler(
            `${currentUser.role} role is not allowed to access this resource`
          )
        );
      }

      const material = await MaterialModel.findById(materialId);
      if (!material) {
        return next(new ErrorHandler("Material not found", 404));
      }

      const result = await UserModel.updateOne(
        { _id: examineeId },
        { $push: { favoriteId: { $each: [materialId] } } }
      );

      res.status(200).json({
        success: true,
        message: `The material file is successfully added to  ${currentUser.username}`,
        result,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// remove materials on user favorites
export const removeMaterialUserFavorites = catchAsyncError(
  async (req, res, next) => {
    try {
      const materialId = req.params.id;

      const examineeId = req?.user?._id;

      if (!examineeId) return next(new ErrorHandler("Invalid user ID", 400));

      const currentUser = await UserModel.findById(examineeId);
      if (currentUser.role === "admin") {
        return next(
          new ErrorHandler(
            `${currentUser.role} role is not allowed to access this resource`
          )
        );
      }

      const material = await MaterialModel.findById(materialId);
      if (!material) {
        return next(new ErrorHandler("Material not found", 404));
      }

      const result = await UserModel.updateOne(
        { _id: examineeId },
        { $pull: { favoriteId: materialId } }
      );

      res.status(200).json({
        success: true,
        message: `The material file is successfully remove on ${currentUser.username}`,
        data: result,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// view single material
export const viewMaterialByOtherUser = catchAsyncError(
  async (req, res, next) => {
    try {
      const materialId = req?.params?.id;

      const material = await MaterialModel.findById(materialId)
        .populate("licenseId")
        .populate("subjectId")
        .populate("uploadedBy");

      if (!material) {
        return next(new ErrorHandler("No material found", 404));
      }

      res.status(200).json({
        success: true,
        message: "Material successfully retrieved",
        material,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
