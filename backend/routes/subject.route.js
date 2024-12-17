import express from "express";
import {
  addSubject,
  getAllSubject,
  getAllSubjectOnPublic,
  updateSubject,
  deleteSubject,
} from "../controllers/subject.controller.js";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";

const subjectRouter = express.Router();

subjectRouter.post(
  "/add-subject",
  isAuthenticated,
  authorizeRoles("admin"),
  addSubject
);

subjectRouter.get(
  "/get-subjects",
  isAuthenticated,
  authorizeRoles("examinee", "admin"),
  getAllSubject
);

subjectRouter.get("/public/subjects", getAllSubjectOnPublic);

subjectRouter.put(
  "/update-subject/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateSubject
);

subjectRouter.delete(
  "/remove-subject/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteSubject
);

export default subjectRouter;
