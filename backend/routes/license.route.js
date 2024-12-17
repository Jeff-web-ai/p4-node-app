import express from "express";
import {
  addLicense,
  getAllLicense,
  getAllLicenseOnPublic,
  viewLicense,
  updateLicense,
  deleteLicense,
} from "../controllers/license.controller.js";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";

const licenseRouter = express.Router();

licenseRouter.post(
  "/add-license",
  isAuthenticated,
  authorizeRoles("admin"),
  addLicense
);

licenseRouter.get(
  "/get-licenses",
  isAuthenticated,
  authorizeRoles("examinee", "admin"),
  getAllLicense
);

licenseRouter.get("/public/licenses", getAllLicenseOnPublic);

licenseRouter.get(
  "/view-license/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  viewLicense
);

licenseRouter.put(
  "/update-license/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateLicense
);

licenseRouter.delete(
  "/remove-license/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteLicense
);

export default licenseRouter;
