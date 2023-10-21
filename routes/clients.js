const express = require("express");
const router = express.Router();
const { verifyToken, checkUser, checkRole } = require("../helpers/auth");

const {
  addOne,
  getAll,
  exportClients,
  readOne,
  updateOne,
  deleteOne,
} = require("../controllers/clients");
router.post("/clients", verifyToken, addOne);
router.get("/clients", verifyToken, getAll);
router.get(
  "/export/excel",
  verifyToken,
  checkUser,
  checkRole("admin"),
  exportClients,
);
router.get("/client/:id", verifyToken, readOne);
router.put("/client/update/:id", verifyToken, updateOne);
router.get(
  "/client/delete/:id",
  verifyToken,
  checkUser,
  checkRole("admin"),
  deleteOne,
);

module.exports = router;
