var Joi = require('joi');
 
module.exports = {
  body: {
    ndocument: Joi.number().integer().required(),
    nhc: Joi.number().integer().required()
  }
};