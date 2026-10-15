const BaseController = require('../core/BaseController');
const SignUpNewsletter = require('../models/SignUpNewsletter');
const config = require('../config');

const signUpNewsletterController = new BaseController(SignUpNewsletter, {
  name: 'signUpNewsletter',
  get: {
    pagination: config.pagination,
  },
});

module.exports = signUpNewsletterController;
