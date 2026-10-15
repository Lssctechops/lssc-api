const BaseController = require('../core/BaseController');
const Map = require('../models/Map');
const config = require('../config');

const mapController = new BaseController(Map, {
  name: 'map',
  access: 'Admin',
  get: {
    pagination: config.pagination,
    sort: { priority: 1 },
    query: ["category"], // for filter
    pre: async (payload, req, res) => {
      if (req.query.lat && req.query.lng) {
        if (req.query.lat && req.query.lng) {
          const lat = parseFloat(req.query.lat);
          const lng = parseFloat(req.query.lng);

          if (!isNaN(lat) && !isNaN(lng)) {
            payload.location = {
              $near: {
                $geometry: {
                  type: "Point",
                    coordinates: [85.309563, 23.344101]
                },
                $maxDistance: 10000 // in meters
              }
            }
          };
        } else {
          return res.status(400).json({ error: "Invalid latitude or longitude format" });
        }
      }
    }
  }
})

module.exports = mapController;
