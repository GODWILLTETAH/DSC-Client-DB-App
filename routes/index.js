const express = require("express");
const router = express.Router();

const {
  form,
  dataTable,
  signup,
  newUser,
  signin,
  loginForm,
  logout,
  getAll,
  admin,
  updateOne,
  deleteOne,
  editOne,
} = require("../controllers/index");
const { verifyToken, checkUser, checkRole } = require("../helpers/auth");

router.get("/", verifyToken, checkUser, form);
router.get("/admin", verifyToken, checkUser, checkRole("admin"), admin);

router.get("/allusers", verifyToken, checkUser, checkRole("admin"), getAll);

router.get("/clients", verifyToken, checkUser, dataTable);
router.get("/logout", verifyToken, logout);
router.get("/signin", loginForm);
router.get("/signup", verifyToken, checkUser, checkRole("admin"), signup);
router.get("/user/:id", verifyToken, checkUser, checkRole("admin"), editOne);

router.post("/user", verifyToken, checkUser, checkRole("admin"), newUser);
router.put(
  "/user/update/:id",
  verifyToken,
  checkUser,
  checkRole("admin"),
  updateOne,
);
router.get(
  "/user/delete/:id",
  verifyToken,
  checkUser,
  checkRole("admin"),
  deleteOne,
);

router.post("/signin", signin);

module.exports = router;
