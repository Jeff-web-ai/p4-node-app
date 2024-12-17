import express from "express";
import multer from "multer";
import {
  addMaterial,
  getMaterialsByUser,
  getUserFavorites,
  getAllMaterials,
  getAllMaterialsOnPublic,
  addMaterialUserFavorites,
  removeMaterialUserFavorites,
  viewMaterialByOtherUser,
} from "../controllers/material.controller.js";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";

const materialRouter = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

materialRouter.post(
  "/materials/upload-material",
  isAuthenticated,
  authorizeRoles("examinee"),
  upload.array("files"),
  addMaterial
);

materialRouter.get(
  "/materials/my-uploads",
  isAuthenticated,
  authorizeRoles("examinee"),
  getMaterialsByUser
);

materialRouter.get(
  "/materials/my-favorites",
  isAuthenticated,
  authorizeRoles("examinee"),
  getUserFavorites
);

materialRouter.get(
  "/get-materials",
  isAuthenticated,
  authorizeRoles("admin", "examinee"),
  getAllMaterials
);

materialRouter.get("/public/materials", getAllMaterialsOnPublic);

materialRouter.post(
  "/materials/add-favorites/:id",
  isAuthenticated,
  authorizeRoles("examinee"),
  addMaterialUserFavorites
);

materialRouter.post(
  "/materials/remove-favorites/:id",
  isAuthenticated,
  authorizeRoles("examinee"),
  removeMaterialUserFavorites
);

materialRouter.get(
  "/materials/view/:id",
  isAuthenticated,
  authorizeRoles("examinee"),
  viewMaterialByOtherUser
);

export default materialRouter;
