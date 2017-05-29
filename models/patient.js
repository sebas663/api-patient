var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
//Define a schema
var Schema = mongoose.Schema;

var db = mongoose.connection;

autoIncrement.initialize(db);

var PatientSchema = new Schema({
        name: String,
        surname: String,
        ndocument: {type: Number, unique: true },
        nhc: {type: Number, unique: true },
        documentTypeCode: String,
        sexTypeCode: String,
        email:String
});

PatientSchema.plugin(autoIncrement.plugin, { model: 'Patient', field: 'nhc' });
// the schema is useless so far
// we need to create a model using it
var Patient = mongoose.model('Patient', PatientSchema);

// make this available to our users in our Node applications
module.exports = Patient;