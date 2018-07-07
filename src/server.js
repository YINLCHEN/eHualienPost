const express = require('express');
const path = require('path');
const app = express();
var mongoose = require('mongoose');

var uri = process.env.MONGOLAB_URI || 'mongodb://custom:!QAZ2wsx@ds153958.mlab.com:53958/heroku_8n50nr6t'
mongoose.connect(uri, function(err, db){
    if(err){
        console.log('Unable to connect to the mongoDB server.', err);
    }
    else{
        console.log('Connection established!', uri);
    }
});

//DB Server
//Schema
//Portfolio
var Schema = mongoose.Schema;
var portfolioSchema = new Schema({
    author: String,
    image:  String,
    title:  String,
    body:   String,
    link:   String,
    date: { type: Date, default: Date.now },
    hidden: Boolean,
});

//Resume
var WorkNestedSchema = new Schema({
    WorkTime: String,
    Company:  String,
    Describe: String
});
var ProjectNestedSchema = new Schema({
    Title:    String,
    Describe: String
});
var resumeSchema = new Schema({
    Author: String,
    About:  String,
    WorkExperience:     [WorkNestedSchema],
    ProjectExperience:  [ProjectNestedSchema],
    Date: { type: Date, default: Date.now }
});

//Config
var configSchema = new Schema({
    Author: String,
    Background: Number,
    WelcomeMessage: [String]
});

//Log
var logSchema = new Schema({
    IP: String,
    Date: { type: Date, default: Date.now }
});

//Skill
var skillSchema = new Schema({
    Classify:  String,
    SkillName: String,
    SkillLogo: String,
    Tag:       String
});

//Model
var Portfolio = mongoose.model('Portfolio', portfolioSchema);
var Resume = mongoose.model('Resume', resumeSchema);
var Config = mongoose.model('Config', configSchema);
var Log = mongoose.model('Log', logSchema);
var Skill = mongoose.model('Skill', skillSchema);

//ODM
var skill = new Skill({
    Classify:  "Front",
    SkillName: "React",
    SkillLogo: "ReactLogo",
    Tag:       ""
})

app.use(express.static('build'));

app.get('/', function (req, res) {
    res.sendFile(path.join('index.html'));
});

app.get('/index', function(req, res) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if( ip != "123.194.133.19" && ip != "127.0.0.1" && ip.substring(0, 7) != "192.168" && ip != "114.42.89.178"){
        var log = new Log({
            IP: ip
        })
        log.save(function (err) {
            if (err){
                console.log ('Error on save!')
            }
            else{
                console.log ('Save Success!')
            }
        });
    }
    
    Config.find({}).exec(function(err, config) {
        var map = {};
    
        config.forEach(function(config) {
            map[config._id] = config;
        });
  
        if(err){
            res.send(err);
            }
        res.json(map);
    });
});

app.get('/portfolio', function(req, res) {
    Portfolio.find({}).sort({"date":1}).exec(function(err, portfolios) {
        var map = {};
    
        portfolios.forEach(function(portfolio) {
            map[portfolio._id] = portfolio;
        });
  
        if(err){
            res.send(err);
            }
        res.json(map);
    });
});

app.get('/resume', function(req, res) {
    Resume.find({}).sort({"date":1}).exec(function(err, resume) {
        var map = {};
        
        resume.forEach(function(resume) {
            map[resume._id] = resume;
        });
  
        if(err){
            res.send(err);
        }
        res.json(map);
    });
    
});

var port = process.env.PORT || 3001;
app.listen(port, "0.0.0.0");