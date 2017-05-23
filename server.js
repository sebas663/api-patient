var express     =   require("express");
var compression =   require('compression')
var app         =   express();
var bodyParser  =   require("body-parser");
var mongoose    =   require('mongoose');
var Patient  =   require('./models/patient');
var PatientCtrl  =   require('./controllers/patient');

require('dotenv').config();

const port = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));
//app.use(methodOverride());
app.use(compression())

var mongoDB = process.env.MONGODBCON;
mongoose.connect(mongoDB);

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var router      =   express.Router();
router.get("/",function(req,res){
    res.json({"message" : "No hay un recurso aqui!!!"});
});
app.use('/',router);

// API routes
var patientRoute = express.Router();

patientRoute.route('/patients')
  .get(PatientCtrl.findAll)
  .post(PatientCtrl.add);

patientRoute.route('/patients/:id')
  .get(PatientCtrl.findById)
  .put(PatientCtrl.update)
  .delete(PatientCtrl.delete);

app.use('/api', patientRoute);


app.listen(port, () => {
    console.log(`Server is running on port ${port}.`)
})
