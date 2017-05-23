//File: controllers/patient.js
var mongoose    =   require('mongoose');

// set Promise provider to bluebird
mongoose.Promise = require('bluebird');

var Patient  =   require('../models/patient');

//GET - Return all patients in the DB
exports.findAll = function(req, res) {
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
};

//GET - Return a patient with specified ID
exports.findById = function(req, res) {
	var promise = Patient.findById(req.params.id).exec();
	promise.then(function(patient) {
		console.log('GET /patients/' + req.params.id);
		return res.status(200).jsonp(patient);
	})
	.catch(function(err){
		// just need one of these
		console.log('error:', err);
		return res.send(500, err.message);
	});
};

//POST - Insert a new Patient in the DB
exports.add = function(req, res) {
	console.log('POST');
	console.log(req.body);

	var patient = new Patient({
		id: req.body.id,
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
		return res.status(200).jsonp(patient);
	})
	.catch(function(err){
		// just need one of these
		console.log('error:', err);
		return res.send(500, err.message);
	});
};

//PUT - Update a register already exists
exports.update= function(req, res) {
	var promise = Patient.findById(req.params.id).exec();

	promise.then(function(patient) {
		patient.id = req.body.id,
		patient.name = req.body.name,
        patient.surname = req.body.surname,
        patient.ndocument = req.body.ndocument,
        patient.nhc = req.body.nhc,
        patient.documentTypeCode = req.body.documentTypeCode,
		patient.sex = req.body.sex,
		patient.email = req.body.email
		return patient.save(); // returns a promise
	})
	.then(function(patient) {
		return res.status(200).jsonp(patient);
	})
	.catch(function(err){
		// just need one of these
		console.log('error:', err);
		return res.send(500, err.message);
	});
};

//DELETE - Delete a Patient with specified ID
exports.delete = function(req, res) {
	var promise = Patient.findById(req.params.id).exec();
	promise.then(function(patient) {
		return patient.remove(); // returns a promise
	})
	.then(function(patient) {
		return res.status(200);
	})
	.catch(function(err){
		// just need one of these
		console.log('error:', err);
		return res.send(500, err.message);
	});
};