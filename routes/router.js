const express = require('express')
const path = require('path');
const bodyParser = require('body-parser');
const router = express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.get('/', function (req, res) {
    res.render('index')
});

router.get('/array', function (req, res) {
    res.render('homepage')
});

router.get('/face-recognition', function (req, res) {
    res.render('recognition')
});

router.get('/cool-guy', function (req, res) {
    res.render('coolGuy')
});

router.get('/underwater', function (req, res) {
    res.render('underwater')
});

router.get('/assets/patrick.jpg', function (req, res) {
    res.sendFile(path.join(__dirname, "/assets/patrick.jpg"));
});

module.exports = router ;
