const express = require('express');
const app = express();
const router = express.Router();
const products  = require('../models/project_details')
const path=require('path');

router.get('/',async(req,res)=>{
    try {
        const userData  = await products.find();
        res.render('project/project',{userData:userData});
        
    } catch (error) {
        res.status(404).send(error);
    }
});

router.get('/:projTitle',async(req,res)=>{
    const userData=await products.findOne({title:req.params.projTitle})
        res.render('project/project',{proj:userData});
    
});

module.exports =  router;