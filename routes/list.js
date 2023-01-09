const { Router } = require('express');
const bodyParser=require('body-parser');
const express = require('express');
const lrouter = express.Router();
const products  = require('../models/project_details')
const path=require('path');
const info_path=path.join(__dirname,'views/HomePage')
const app = express();
app.set("view engine","hbs")
app.set("views",info_path);
app.use(express.static(path.join(__dirname,'./public/')))
lrouter.use(bodyParser.json());

lrouter.route('/')
.get(async(req,res)=>{
    console.log("Heloo-1")
    try {
        console.log(res);
        const userData  = await products.find();
        res.render('info',{userData:userData});
        console.log(userData)
        
    } catch (error) {
        res.status(404).send(error);
    }
});

lrouter.route('/:projTitle')
.get(async(req,res,next)=>{
    const userData=await products.findOne({title:req.params.projTitle})
    .then((proj)=>{
        let len = proj["technologies"].length;
        // res.statusCode=200;
        // res.setHeader('Content-Type','application/json')
        // console.log(prij.title)
        console.log(proj);
        res.render('info',{proj:proj, len:len});
        // res.json(dishes);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

module.exports =  lrouter;