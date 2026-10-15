const BaseController = require('../core/BaseController');
const GoverningCouncil = require('../models/GoverningCouncil');
const config = require('../config');

const governingCouncilController = new BaseController(GoverningCouncil, {
  name: 'governingCouncil',
  access: 'admin',
  get: {
    sort: { position: 1 },
    pagination: config.pagination,
  },
});

module.exports = governingCouncilController;