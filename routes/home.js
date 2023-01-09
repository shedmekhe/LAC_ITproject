const express = require('express');
const path=require('path')
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/userModel')
const {loginrequired} = require('../config/JWT')
const app=express();
const info_path=path.join(__dirname,'views/HomePage')
app.set("view engine","hbs")
app.set("views",info_path);
router.get('/',(req,res)=>{
    res.render('index');
})

router.get('/dashboard',loginrequired,(req,res)=>{
    res.render('dashboard')
})

router.get('/home',loginrequired,(req,res)=>{
    // console.log(res.user);
    const _id=res.user;
    const curr_user = User.findOne({_id}).then((msg) => {
        res.render('home',{name : msg.name});
        
    }).catch((err) => {
        console.log(err);
    });
    // console.log(curr_user);
})

router.get('/logout',(req,res)=>{
    res.cookie('access-token',"",{maxAge: 1 })
    res.redirect('/user/login');
})

router.get('/project',(req,res)=>{
    res.render('project')
})

module.exports = router;