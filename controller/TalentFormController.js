const BaseController = require('../core/BaseController');
const TalentForm = require('../models/TalentForm');
const config = require('../config');

const talentFormController = new BaseController(TalentForm, {
  name: 'talentForm',
  access: 'admin',
  get: {
    pagination: config.pagination,
    query: ["status", "quickHiring", "gender"]
  },
});

module.exports = talentFormController;
