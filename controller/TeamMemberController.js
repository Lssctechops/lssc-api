const BaseController = require('../core/BaseController');
const TeamMember = require('../models/TeamMember');
const config = require('../config');

const teamMemberController = new BaseController(TeamMember, {
  name: 'teamMember',
  access: 'admin',
  get: {
    sort: { position: 1 },
    pagination: config.pagination,
  },
});

module.exports = teamMemberController;