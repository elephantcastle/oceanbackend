var express = require('express');
var router = express.Router();
var Test = require('../models/Test.js');
var Result = require('../models/Result.js');
const utils = require('../utils/index.js');

/* GET SINGLE TEST BY ID */
router.get('/:id', function (req, res, next) {
  console.log(req.params.id)
  Test.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    try {
      const { groupedFacets, traits, _id, updated_date } = post
      const finalResult = { groupedFacets, traits }
      const info = { _id, updated_date }
      const results = { finalResult, info }
      res.json(results);
    } catch (error) {
      res.json(error);
    }
  });
});

/* SAVE TEST */
router.post('/', function (req, res, next) {
  // store the answers
  Result.create({
    age: req.body.age,
    sex: req.body.sex,
    language: req.body.language || 'english',
    testdata: req.body.testdata
  })

  //calculate the score based on the answers to the test
  utils.calculateScores(req.body.testdata, req.body.sex, req.body.age).then(resultData => {
    Test.create({
      age: req.body.age,
      sex: req.body.sex,
      language: req.body.language || 'english',
      traits: resultData.traits,
      groupedFacets: resultData.groupedFacets,
    }, function (err, post) {
      if (err) { return next(err); } else {
        try {
          const { groupedFacets, traits, _id, updated_date } = post
          const finalResult = { groupedFacets, traits }
          const info = { _id, updated_date }
          const results = { finalResult, info }
          res.json(results);
        } catch (error) {
          res.json(error);
        }
      }
    });
  })
});

module.exports = router;
