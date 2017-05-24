var Joi = require('joi');
 
module.exports = {
  body: {
    userID: Joi.string().alphanum().min(10).max(40).required()
  }
};