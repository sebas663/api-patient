//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var PatientSchema = new Schema({
        id: Number,
        name: String,
        surname: String,
        ndocument: Number,
        nhc:Number,
        documentTypeCode: String,
        sex: String,
        email:String
});
// the schema is useless so far
// we need to create a model using it
var Patient = mongoose.model('Patient', PatientSchema);

// make this available to our users in our Node applications
module.exports = Patient;