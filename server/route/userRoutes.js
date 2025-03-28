import express from "express";
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  getUserById,
  assignManager,
} from "../controller/userController.js";

const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:userId", getUserById);
// router.put("/:userId", updateUser);
router.put("/asmanager/:userId", assignManager);


router.put("/:uid", updateUser);
router.delete("/:userId", deleteUser);

export default router;
