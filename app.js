const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const fs = require("fs");
let testdata = JSON.parse(fs.readFileSync("./data/testdata.json"));
let testdata300 = JSON.parse(fs.readFileSync("./data/testdata300.json"));

let test = require('./routes/test');
const app = express();

app.use(cors());
  
//setup moongose with bluebird promise handling
let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.set('useCreateIndex', true)

const mongoString = process.env.MONGO_URL || 'mongodb://localhost:27017/ocean'

mongoose.connect(mongoString, { promiseLibrary: require('bluebird'),  useNewUrlParser: true, useUnifiedTopology: true})
  .then(() =>  console.log('Db connection succesful'))
  .catch((err) => console.error(err));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));

app.use('/test', test);

app.get('/testdata', function (req, res, next) {
    res.json(testdata);
});

app.get('/testdata300', function (req, res, next) {
  res.json(testdata300);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
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
app.set('port', port);
let server = http.createServer(app);

server.listen(port, () => {
    console.log(`listening on ${port}`);
});