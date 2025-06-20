var express = require('express');
var router = express.Router();
const UserController = require("../controller/userController");
const authenticateToken = require('../middleware/jwt');

router.post("/addUser", UserController.adduser);
router.put("/editUser/:id", authenticateToken, UserController.editUser);
router.delete("/deleteUser/:id", authenticateToken, UserController.delUser);
router.get("/display",  UserController.displayUser);
router.post("/login", UserController.login);
router.post("/forgetPassword", UserController.forgetPassword);
router.put('/resetPassword/:token', UserController.resetPassword);
router.post('/findBymail', UserController.findUserByEmail);
router.get('/countPersonel', UserController.countPersonelle);
router.get('/countPatient', UserController.countPatient);
router.put('/updateUserInfo/:id', UserController.editUserPersonalInfo);
router.put('/updateUserAddress/:id', UserController.editUserAdresslInfo);

router.post('/editEmail', UserController.editEmail);
router.get('/confirmEmail/:token', UserController.confirmEmailChange);

module.exports = router;