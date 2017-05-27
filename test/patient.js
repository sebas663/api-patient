var mongoose     = require("mongoose");
// set Promise provider to bluebird
mongoose.Promise = require('bluebird');
var Patient      = require('../models/patient');
//Require the dev-dependencies
var chai         = require('chai');
var chaiHttp     = require('chai-http');
//var chaiAsPromised = require("chai-as-promised");
//var server      =   require('../server');
var server       = 'http://localhost:4200';
// Add promise support if this does not exist natively.

//chai.use(chaiAsPromised);
chai.use(chaiHttp);

var should = chai.should();

//For work whit environment variable.
require('dotenv').config();

describe('Patients', () => {
    beforeEach(() => {
        Patient.remove({}, (err) => { 
           done();         
        });
    });
  describe('/GET patients', () => {
      it('it should GET all the patients', () => {
             chai.request(server)
            .get('/api/' + process.env.API_VERSION + '/patients')
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.eql(0);
            })
            .catch(function (err) {
                console.log("Promise Rejected");
            });
      });
  });

  describe('/POST patient', () => {
      it('when missing item in payload, should return a 400 ok response and a single error', () => {
        var patient = {
                name: "nombre1 test",
                documentTypeCode: "DNI",
                email:"String@test.com"
            }
            chai.request(server)
            .post('/api/' + process.env.API_VERSION + '/patients')
            .send(patient)
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('errors');
                expect(res.body.errors).to.have.property('surname');
                expect(res.body.errors).to.have.property('ndocument');
                expect(res.body.errors).to.have.property('sex');
            })
            .catch(function (err) {
                console.log("Promise Rejected");
            })
      });
      it('when wrong email added, should return a 400 ok response and a single error', () => {
        var patient = {
                name: "nombre2 test",
                surname: "Apellido2",
                ndocument: 29799661,
                documentTypeCode: "DNI",
                sex: "M",
                email:"String2est.com"
            }
            chai.request(server)
            .post('/api/' + process.env.API_VERSION + '/patients')
            .send(patient)
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('errors');
                expect(res.body.errors).to.have.property('email');
            })
            .catch(function (err) {
                console.log("Promise Rejected");
            })
      });
      it('it should POST a patient ', () => {
        var patient = {
                name: "nombre2 test",
                surname: "Apellido2",
                ndocument: 29799662,
                documentTypeCode: "DNI",
                sex: "M",
                email:"String2@test.com"
            }
            chai.request(server)
            .post('/api/' + process.env.API_VERSION + '/patients')
            .send(patient)
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('message').eql('Patient successfully added!');
                expect(res.body.patient).to.have.property('name');
                expect(res.body.patient).to.have.property('surname');
                expect(res.body.patient).to.have.property('ndocument');
                expect(res.body.patient).to.have.property('nhc');
                expect(res.body.patient).to.have.property('documentTypeCode');
                expect(res.body.patient).to.have.property('sex');
                expect(res.body.patient).to.have.property('email');
            })
            .catch(function (err) {
                console.log("Promise Rejected");
            });
      });
  });
  describe('/GET/:id patient', () => {
      it('it should GET a patient by the given id', () => {
        var patient = new Patient({ 
                                    name: "nombre3 test",
                                    surname: "Apellido3",
                                    ndocument: 29799663,
                                    documentTypeCode: "DNI",
                                    sex: "M",
                                    email:"String3@test.com"
                                });
        patient.save((err, patient) => {
            chai.request(server)
            .get('/api/' + process.env.API_VERSION + '/patients/' + patient.id)
            .send(patient)
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.patient).to.have.property('name');
                expect(res.body.patient).to.have.property('surname');
                expect(res.body.patient).to.have.property('ndocument');
                expect(res.body.patient).to.have.property('nhc');
                expect(res.body.patient).to.have.property('documentTypeCode');
                expect(res.body.patient).to.have.property('sex');
                expect(res.body.patient).to.have.property('email');
                expect(res.body).to.have.property('_id').eql(patient.id);
            })
            .catch(function (err) {
                console.log("Promise Rejected");
            });
        });

      });
  });
  describe('/PUT/:id patient', () => {
      it('it should UPDATE a patient given the id', () => {
        var patient = new Patient({ 
                                    name: "nombre4 test",
                                    surname: "Apellido4",
                                    ndocument: 29799664,
                                    documentTypeCode: "DNI",
                                    sex: "M",
                                    email:"String4@test.com"
                                })
        patient.save((err, patient) => {
                chai.request(server)
                .put('/api/' + process.env.API_VERSION + '/patients/' + patient.id)
                .send({ 
                        name: "nombre4",
                        surname: "Apellido",
                        ndocument: 29799665,
                        documentTypeCode: "DNI",
                        sex: "M",
                        email:"String4@test.com"
                    })
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('message').eql('Patient successfully updated.');
                    expect(res.body.patient).to.have.property('name').eql("nombre4");
                    expect(res.body.patient).to.have.property('surname').eql("Apellido");
                    expect(res.body.patient).to.have.property('ndocument').eql(29799665);  
                })
                .catch(function (err) {
                    console.log("Promise Rejected");
                });
          });
      });
  });
  /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:id patient', () => {
      it('it should DELETE a patient given the id', () => {
        var patient = new Patient({
                                    name: "nombre5 test",
                                    surname: "Apellido5",
                                    ndocument: 29800666,
                                    documentTypeCode: "DNI",
                                    sex: "M",
                                    email:"String5@test.com"
                                })
        patient.save((err, patient) => {
                chai.request(server)
                .DELETE('/api/' + process.env.API_VERSION + '/patients/' + patient.id)
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('message').eql('Patient successfully deleted.');
                    expect(res.body.result).to.have.property('ok').eql(1);
                })
                .catch(function (err) {
                    console.log("Promise Rejected");
                });
          });
      });
  });
});