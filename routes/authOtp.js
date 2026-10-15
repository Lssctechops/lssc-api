const express =  require("express");
const authController  =  require("../controller/auth");
const  router =  express.Router();

router.post("/register",authController.register);
router.post("/otp" , authController.sendOtp);
router.post("/login",authController.login);
router.post("/verify" , authController.verifyOtp);
router.post("/logout",authController.authenticateToken, authController.logout);
router.get("/profile",authController.authenticateToken, authController.getUser);
router.put("/profile",authController.authenticateToken ,authController.updateUser);


module.exports  =  router;