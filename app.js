const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());

//setup moongose with bluebird promise handling
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const mongoString = process.env.MONGO_URL || 'mongodb://localhost:27017/ocean'
async function main() { await mongoose.connect(mongoString); }
main().then(() =>  console.log('Db connection succesful')).catch(err => console.log(err));


const fs = require("fs");
let testdata = JSON.parse(fs.readFileSync("./data/testdata.json"));
let testdata300 = JSON.parse(fs.readFileSync("./data/testdata300.json"));

let test = require('./routes/test');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({'extended':'true'}));

app.use('/test', test);

app.use('/healthz', function(req, res, next){
  res.status(200).send("OK")
});

app.get('/testdata', function (req, res, next) {
    res.json(testdata);
});

app.get('/testdata300', function (req, res, next) {
  res.json(testdata300);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// restful api error handler
app.use(function(err, req, res, next) {
  if(err){
    next(err)
    console.log(err);
  }else{
    if (req.app.get('env') !== 'development') {
        delete err.stack;
    }
    res.status(err.statusCode || 500).json(err);
  }
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`listening on ${port}`);
});