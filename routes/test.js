var express = require('express');
var router = express.Router();
var Test = require('../models/Test.js');
const utils = require('../utils/index.js');

/* GET SINGLE TEST BY ID */
router.get('/:id', function (req, res, next) {
  Test.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    const { groupedFacets, traits, _id, updated_date } = post
    const finalResult = { groupedFacets, traits }
    const info = { _id, updated_date }
    const results = { finalResult, info }
    res.json(results);
  });
});

/* SAVE TEST */
router.post('/', function (req, res, next) {
  utils.calculateScores(req.body.testdata, req.body.sex, req.body.age).then(resultData => {
    Test.create({
      age: req.body.age,
      sex: req.body.sex,
      language: req.body.language || 'english',
      traits: resultData.traits,
      groupedFacets: resultData.groupedFacets,
    }, function (err, post) {
      if (err) { return next(err); } else {
        const { groupedFacets, traits, _id, updated_date } = post
        const finalResult = { groupedFacets, traits }
        const info = { _id, updated_date }
        const results = { finalResult, info }
        res.json(results);
      }
    });
  })
});

module.exports = router;
