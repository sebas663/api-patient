var express      = require("express");
var mongoose     = require('mongoose');
// set Promise provider to bluebird
mongoose.Promise = require('bluebird');
var Patient      = require('../models/patient');
var validator    = require('express-route-validator')

// API routes
var router = express.Router();

router.route('/patients')
  .get(function (req, res) {
        var promise;
        if(req.query.name && req.query.surname){
           console.log('promise all patients by name and surname')
           var namerx = new RegExp(req.query.name, "i");
           var surnamerx = new RegExp(req.query.surname, "i");
           var query = { name: regex,
                         surname:surnamerx
                       };
           promise = Patient.find(query).exec();
        }else if(req.query.ndocument){
           console.log('promise all patients by ndocument')
           var query = { ndocument: req.query.ndocument };
           promise = Patient.find(query).exec();
        }else if(req.query.nhc){
           console.log('promise all patients by nhc')
           var query = { nhc: req.query.nhc };
           promise = Patient.find(query).exec();
        }else{
           //console.log('promise all patients')
           // find all patients.
           promise = Patient.find().exec();
        }

        promise.then(function(patients) {
           response(res,patients);
        })
        .catch(function(err){
            // just need one of these
            //console.log('error:', err);
            res.status(500).send(err.message);
        });
    })
  .post(validator.validate({
         body: {
                name:             { isRequired: true },
                surname:          { isRequired: true },
                ndocument:        { isRequired: true },
                nhc:              { isRequired: true },
                documentTypeCode: { isRequired: true },
                sex:              { isRequired: true },
                email:            { isRequired: true }
              },
              headers: {
                'content-type': { isRequired: true, equals: 'application/json' }
              }
        }),
        function(req, res) {
            //console.log('POST');
            //console.log(req.body);
            var patient = new Patient({
                  name: req.body.name,
                  surname: req.body.surname,
                  ndocument: req.body.ndocument,
                  nhc:req.body.nhc,
                  documentTypeCode: req.body.documentTypeCode,
                  sex: req.body.sex,
                  email:req.body.email
            });
            var promise = patient.save();
            promise.then(function(patient) {
              response(res,patient);
            })
            .catch(function(err){
              // just need one of these
              //console.log('error:', err);
              res.status(500).send(err.message);
            });
        }
  );

router.route('/patient/:idPatient')
  .get(validator.validate({
          params: {
            idPatient: { isRequired: true , isMongoId: true }
          }
      }),
      function(req, res) {
          var promise = Patient.findById(req.params.idPatient).exec();
          promise.then(function(patient) {
            //console.log('GET /patients/' + req.params.idPatient);
             response(res,patient);
          })
          .catch(function(err){
            // just need one of these
            //console.log('error:', err);
            res.status(500).send(err.message);
          });
       }
  )
  .put(validator.validate({
          params: {
            idPatient: { isRequired: true , isMongoId: true }
          }
      }),
      function(req, res) {
          //console.log('PUT');
          //console.log(req.body);
          var promise = Patient.findById(req.params.idPatient).exec();
          promise.then(function(patient) {
            if(patient){
                patient.name = req.body.name,
                patient.surname = req.body.surname,
                patient.ndocument = req.body.ndocument,
                patient.nhc = req.body.nhc,
                patient.documentTypeCode = req.body.documentTypeCode,
                patient.sex = req.body.sex,
                patient.email = req.body.email
                return patient.save(); // returns a promise
            }
          })
          .then(function(patient) {
              var message = "Patient successfully updated.";                
              response(res,patient,message);
          })
          .catch(function(err){
              // just need one of these
              //console.log('error:', err);
              res.status(500).send(err.message);
          }); 
      }
  )
  .delete(validator.validate({
              params: {
                idPatient: { isRequired: true, isMongoId: true }
              }
          }),
          function(req, res) {
              Patient.findByIdAndRemove(req.params.idPatient, function (err, patient) {  
                 if(err)
                    res.status(500).send(err.message);
                 var message = "Patient successfully deleted.";                
                 response(res,patient,message);
              });
          }
  );
var response = function(res,patient,messageOK,messageNotOK){
    if(patient) {
      var resp = {
                  message: messageOK,
                  id:patient._id
                };
      if(messageOK){
        res.status(200).jsonp(resp);
      }else{
        res.status(200).jsonp(patient);
      }
    }else{
      var dfault =  "Patient Not Found";
      if(messageNotOK){
        res.status(400).send(messageNotOK);
      }else{
        res.status(400).send(dfault);
      }
    }
};
module.exports = router