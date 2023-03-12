var express = require('express');
var app = express();
var path = require('path');
const dotenv=require('dotenv').config();
const hbs=require("hbs");
var projectRouter=require('./routes/project');
var formRouter=require('./routes/form');
var dboardRouter=require('./routes/dashboard');
var homeRouter=require('./routes/home')
var userRouter=require('./routes/user')
const mongoose =require('mongoose');
const flash = require('connect-flash');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const url =process.env.DB_URL;
var shell = require('shelljs');

shell.mkdir('-p', 'local_storage/file1Data');
shell.mkdir('-p', 'local_storage/file2Data');
shell.mkdir('-p', 'local_storage/file3Data');

mongoose.connect(url,{
  useNewUrlParser: true, useUnifiedTopology: true,
})
.then((db)=>{
  console.log("Connected correctly to Database ");  
},(err)=>{
  console.log("Error occured while connecting to database ",err);
})

app.set("view engine","hbs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const template_path=path.join(__dirname,'views/')
app.set("views",template_path);
app.use(express.static(path.join(__dirname, './public/')));
app.use(express.static(path.join(__dirname, './local_storage/')));

app.use(cookieParser(process.env.JWT_SECRET));
app.use(session({
  secret: process.env.JWT_SECRET,
  cookie: {maxAge: 20000}, //20s
  resave:true,
  saveUninitialized: true
}));
app.use(flash()); 


app.use('/home', homeRouter);
app.use('/form',formRouter);
app.use('/project',projectRouter);
app.use('/dashboard',dboardRouter);
app.use('/user',userRouter);


app.get('/',(req,res)=>{
  res.render('welcome');
})


module.exports = app;
