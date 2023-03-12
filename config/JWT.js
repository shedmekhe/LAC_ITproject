const jwt = require('jsonwebtoken');
const User = require('../models/userModel')
const dotenv = require('dotenv').config();

const loginrequired =async (req,res,next)=>{
    const token = req.cookies['access-token']
    if(token){
        const validatetoken = await jwt.verify(token,process.env.JWT_SECRET);
        if(validatetoken)
        {
            res.user = validatetoken.id
            next()
        }
        else{
             res.redirect('/user/login');

        }
    }
    else{
        // console.log('token not found');
        res.redirect('/user/login');
    }
}


const verifyEmail = async(req,res,next)=>{
    let { email, password } = req.body;
    if(!email)
    {
      email='';
    }
    if(!password)
    {
      password='';
    }

    if(email=='' && password=='')
    {
      req.flash('empty-credentials',"Empty credentials");
      res.redirect('/user/login');
    }
    else
    {
    try{
        const user = await User.findOne({email: req.body.email})
        if(!user)
        {
            req.flash('user-not-exist',"User with that mail does not exist");
            res.redirect('/user/login');
        }
        else
        {
        if(user.isVerified){
            next()
        }
        else{
            console.log("Please check your mail to verify your mail account ");
        }
    }
    }
    catch(err)
    {
        console.log(err);
    }
}
}

module.exports = {loginrequired, verifyEmail}