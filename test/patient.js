//During the test the env variable is set to test
//process.env.NODE_ENV = 'test';

var mongoose    =   require("mongoose");
var Patient     =   require('../models/patient');

//Require the dev-dependencies
var chai        =   require('chai');
var chaiHttp    =   require('chai-http');
var server      =   require('../server');

var should = chai.should();

//For work whit environment variable.
require('dotenv').config();

chai.use(chaiHttp);
describe('Patients', () => {
    beforeEach((done) => {
        Patient.remove({}, (err) => { 
           done();         
        });     
    });
  describe('/GET patients', () => {
      it('it should GET all the patients', (done) => {
            chai.request(server)
            .get('/api/' + process.env.API_VERSION + '/patients')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
              done();
            });
      });
  });
  describe('/POST patient', () => {
      it('it should not POST a patient without dni', (done) => {
        var patient = {
                name: "nombre1 test",
                surname: "Apellido1",
                nhc:1,
                documentTypeCode: "DNI",
                sex: "M",
                email:"String@test.com"
            }
            chai.request(server)
            .post('/api/' + process.env.API_VERSION + '/patients')
            .send(patient)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('ndocument');
              done();
            });
      });
      it('it should POST a patient ', (done) => {
        var patient = {
                name: "nombre2 test",
                surname: "Apellido2",
                ndocument: 29799666,
                nhc:2,
                documentTypeCode: "DNI",
                sex: "M",
                email:"String2@test.com"
            }
            chai.request(server)
            .post('/api/' + process.env.API_VERSION + '/patients')
            .send(patient)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Patient successfully added!');
                res.body.patient.should.have.property('name');
                res.body.patient.should.have.property('surname');
                res.body.patient.should.have.property('ndocument');
                res.body.patient.should.have.property('nhc');
                res.body.patient.should.have.property('documentTypeCode');
                res.body.patient.should.have.property('sex');
                res.body.patient.should.have.property('email');
              done();
            });
      });
  });
  describe('/GET/:id patient', () => {
      it('it should GET a patient by the given id', (done) => {
        var patient = new Patient({ name: "nombre3 test",
                                    surname: "Apellido3",
                                    ndocument: 29799664,
                                    nhc:4,
                                    documentTypeCode: "DNI",
                                    sex: "M",
                                    email:"String3@test.com"
                                });
        patient.save((err, patient) => {
            chai.request(server)
            .get('/api/' + process.env.API_VERSION + '/patients/' + patient.id)
            .send(patient)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.patient.should.have.property('name');
                res.body.patient.should.have.property('surname');
                res.body.patient.should.have.property('ndocument');
                res.body.patient.should.have.property('nhc');
                res.body.patient.should.have.property('documentTypeCode');
                res.body.patient.should.have.property('sex');
                res.body.patient.should.have.property('email');
                res.body.should.have.property('_id').eql(patient.id);
              done();
            });
        });

      });
  });
  describe('/PUT/:id patient', () => {
      it('it should UPDATE a patient given the id', (done) => {
        var patient = new Patient({ name: "nombre4 test",
                                    surname: "Apellido4",
                                    ndocument: 29799667,
                                    nhc:4,
                                    documentTypeCode: "DNI",
                                    sex: "M",
                                    email:"String4@test.com"
                                })
        patient.save((err, patient) => {
                chai.request(server)
                .put('/api/' + process.env.API_VERSION + '/patients/' + patient.id)
                .send({ name: "nombre4 test",
                        surname: "Apellido4",
                        ndocument: 29799661,
                        nhc:45,
                        documentTypeCode: "DNI",
                        sex: "M",
                        email:"String4@test.com"
                    })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Patient updated!');
                    res.body.patient.should.have.property('ndocument').eql(29799661);
                    res.body.patient.should.have.property('nhc').eql(45);
                  done();
                });
          });
      });
  });
 /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:id patient', () => {
      it('it should DELETE a patient given the id', (done) => {
        var patient = new Patient({ name: "nombre5 test",
                                    surname: "Apellido5",
                                    ndocument: 29800667,
                                    nhc:7,
                                    documentTypeCode: "DNI",
                                    sex: "M",
                                    email:"String5@test.com"
                                })
        patient.save((err, patient) => {
                chai.request(server)
                .DELETE('/api/' + process.env.API_VERSION + '/patients/' + patient.id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Patient successfully DELETEd!');
                    res.body.result.should.have.property('ok').eql(1);
                  done();
                });
          });
      });
  });
});