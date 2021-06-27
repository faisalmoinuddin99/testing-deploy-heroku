require("dotenv").config();
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
var logger = require('morgan');
const mongoose = require('mongoose')
const path = require('path')
const app = express()

// connect to db
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => {
        console.log("DB CONNECTED");
    })
    .catch((err) => console.log("Connection error: " + err));

//logger
app.use(logger('dev'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// create collection
var conn = mongoose.Collection;

// schema
var employeeSchema = new mongoose.Schema({
    name: String,
    email: String,


});


var empModel = mongoose.model('Employee', employeeSchema);
var employee = empModel.find({});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    employee.exec(function (err, data) {
        if (err) throw err
        res.render('index', { title: 'Employee Records', records: data })
    })
})

app.post('/', function (req, res, next) {
    var empDetails = new empModel({
        name: req.body.uname,
        email: req.body.email,

    });
    console.log(empDetails);
    empDetails.save(function (err, req1) {
        if (err) throw err;
        employee.exec(function (err, data) {
            if (err) throw err;
            res.render('index', { title: 'Employee Records', records: data, success: 'Record Inserted Successfully' });

        });
    })


});

app.get('/all', (req, res) => {
    employee.find().populate().exec((err, empDetails) => {
        if (err || !empDetails) {
            return res.status(400).json({
                error: "No data found"
            })
        }
        return res.json(empDetails)
    })
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`server is running at ${port}....`);
})