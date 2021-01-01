const express = require('express');
// const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

let test = require('./routes/test');
const app = express();

let corsOptions = {
  origin: ['http://localhost:8080', 'https://oceanfrontend2.vercel.app', 'https://ecstatic-mahavira-da940c.netlify.app'],
  // credentials: true,
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'] };
app.use(cors(corsOptions));
  
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
// if(process.env.NODE_ENV === 'production'){
//   app.use(express.static(path.join(__dirname,  './dist' )));
//   app.use('/results', express.static(path.join(__dirname,  './dist' )));
//   app.use('/results/:id', express.static(path.join(__dirname,  './dist' )));
//   app.use('/test', express.static(path.join(__dirname,  './dist' )));
//   app.use('/intro', express.static(path.join(__dirname,  './dist' )));
//   app.use('/about', express.static(path.join(__dirname,  './dist' )));
//   app.use('/policy', express.static(path.join(__dirname,  './dist' )));
// }
app.use('/test', test);


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