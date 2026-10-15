const  AuthController  = require("../core/AuthController");
const  User   = require("../models/User");
const config = require('../config');

const authConfig = {
    jwtSecret: config.jwtSecret.jwtSecret,
    jwtExpiresIn: config.jwtSecret.expiresIn ,       // Optional
    loginType: 'password',         // 'password' or 'otp'
    otpField: 'mobile',      // 'mobile' or 'email'
    otpLimit: 5,              // OTP attempts allowed per minute
    otpExpiry: 10 * 60 * 1000 // OTP validity in milliseconds
  };



const   authController  =  new AuthController(User, authConfig)

module.exports =  authController

