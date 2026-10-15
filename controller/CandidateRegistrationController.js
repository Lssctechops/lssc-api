const BaseController = require('../core/BaseController');
const CandidateRegistration = require('../models/CandidateRegistration');
const User = require('../models/User');
const config = require('../config');

async function generateUniqueCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  const existingUser = await User.findOne({ ownReferCode: code });
  if (existingUser) {
    return generateUniqueCode();
  }
  return code;
}

const candidateRegistrationController = new BaseController(CandidateRegistration, {
  name: 'candidateRegistration',
  get: {
    pagination: config.pagination,
    populate:[{path:'course'}] 
  },
  getById: {
    populate: [{ path: 'course' }]
  },
  create: {
    pre: async (payload, req, res) => {
      try {
        const { name, email, mobile } = payload.personalDetails;

        if (!name || !email || !mobile) {
          throw new Error("Missing required fields: name, email, mobile");
        }

        // Check if user exists
        const existing = await User.findOne({ $or: [{ email }, { mobile }] });

        if (existing) {
          return res.status(400).json({
            message: 'User with this email or mobile already exists',
            error: 'UserAlreadyExists'
          });
        }

        const otpCode = '123456';
        let employeeId = await generateUniqueCode();
        const user = new User({
          name,
          email,
          mobile,
          isVerified: false,
          role: 'user',
          employeeId,
          otp: [{
            otp: otpCode,
            createdAt: new Date()
          }]
        });

        await user.save();

        // try {
        //   await sendOtpHandler(user.mobile, otpCode); // or user.email based on delivery
        // } catch (err) {
        //   console.error('Error sending OTP:', err);
        //   throw new Error('Failed to send OTP');
        // }

        // Inject userId into CandidateRegistration payload
        payload.user = user._id;

        return payload;
      } catch (error) {
        return res.status(400).json({
          message: error.message || 'Error creating candidate registration',
          error: error
        });
      }
    }
  }
});


module.exports = { candidateRegistrationController };
