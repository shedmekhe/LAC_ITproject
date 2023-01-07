const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto'); 
const path=require('path')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cookie = require('cookie-parser')
const {verifyEmail} = require('../config/JWT')

const app=express();
const info_path=path.join(__dirname,'views/HomePage')
app.set("view engine","hbs")
app.set("views",info_path);


router.get('/register',(req,res)=>{
    res.render('register');
})


// mail sender details
var transporter  =  nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'wceit101@gmail.com',
        pass: 'nkacdihbzttnmvkw'
    },
    tls:{
        rejectUnauthorized: false
    }
})

router.post('/register',async(req,res)=>{
    try{
        const {name,email,password} = req.body;
        const user = new User({
            name,
            email,
            password,
            emailToken : crypto.randomBytes(64).toString('hex'),
            isVerified: false
        })
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(user.password,salt);
        user.password = hashPassword;
        const newUser = await user.save();

        // send mail
        var mailOptions = {
            from: ` "Verify your email" <wceit101@gmail.com>`,
            to: user.email,
            subject: 'wceit101 - verify your email',
            html: `<h2> ${user.name}! Thanks for registering on our site</h2>
                    <h4> Please verify email to continue ...</h4>
                    <a href = "http://${req.headers.host}/user/verify-email?token=${user.emailToken}">Verify your Email</a>`
        }

        // sending mail
        transporter.sendMail(mailOptions,function(error,info){
            if(error)
            {
                console.log(error);
            }
            else{
                // res.send(`<script>alert("Email Sent Successfully.")</script>`);
                console.log("Verification email is sent to your gmail account !!");
                let msg = "Verification email is sent to your gmail account !!"
                res.render('login',{msg});

            }
        })

        res.redirect('/user/login');
    }
    catch(err)
    {
        res.render('register');
        console.log(err);
    }
})

router.get('/verify-email',async(req,res)=>{
    try{
        const token = req.query.token
        const user = await User.findOne({emailToken:token})
        if(user)
        {
            user.emailToken = null,
            user.isVerified = true,
            await user.save()
            res.redirect('/user/login')
        }
        else{
            res.redirect('/user/register') ;
            // alert('Email is not verified');
            console.log('Email is not verified');
        }
    }
    catch(err)
    {
        console.log(err);
    }
})

router.get('/login',(req,res)=>{
    res.render('login');
})


const createToken = (id)=>{
    return jwt.sign({id},"hopewewillwinthegame")
}

router.post('/login',verifyEmail,async(req,res)=>{
    try{
        
        const{email,password} = req.body;
        const findUser = await User.findOne({email:email});
        if(findUser)
        {
            const match = await bcrypt.compare(password,findUser.password);
            if(match)
            {
                const token = createToken(findUser.id)
                // console.log(token);
                res.cookie('access-token',token);
                // res.status(200).json({ user: findUser._id });
                res.redirect('/');
            }
            else{
                // alert("Invalid password")
                console.log("Invalid password");
                let msg = "Invalid Password/ Empty Credentials"
                res.render('login', {msg});
                console.log(msg);

            }
        }
        else{
            // alert('User not registered')
            console.log("User not registered");
            let msg = "User not registered"
            res.render('login', {msg});

        }
    }
    catch(err)
    {
        // console.log("In catch block")
        let msg = "Login issue"
        res.render('login',{msg});

        console.log(err);
    }
})

module.exports = router