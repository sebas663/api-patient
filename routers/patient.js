var express     =   require("express");
var mongoose    =   require('mongoose');
// set Promise provider to bluebird
mongoose.Promise = require('bluebird');
var Patient  =   require('../models/patient');
var validate    =   require('express-validation')
var vFilter     =   require('../validation/filter');
// API routes
var router = express.Router();

router.route('/patients')
  .get(validate(vFilter.filter),function (req, res) {
        console.log('GET /checkBody' + req.body)
	
        //req.checkBody("ndocument", "Enter a number document.").notEmpty();

        var promise = Patient.find().exec();
        promise.then(function(patients) {
            console.log('GET /patients')
            return res.status(200).jsonp(patients);
        })
        .catch(function(err){
            // just need one of these
            console.log('error:', err);
            return res.send(500, err.message);
        });
    })
  //.post(PatientCtrl.add);
/*
router.route('/patients/:id')
  .get(PatientCtrl.findById)
  .put(PatientCtrl.update)
  .delete(PatientCtrl.delete);*/

module.exports = router