var express = require('express');
const app = express();
var router = express.Router();
const User = require('../models/userModel');
const projects  = require('../models/project_details')
const { loginrequired } = require('../config/JWT');



router.get('/',loginrequired,  async(req, res, next)=>{
  let _id=res.user;
  let curr_user =await User.findOne({"_id":_id});
  let projectData= await projects.find({$and:[{email:email}]})
  res.render('dashboard/dashboard',{proj:projectData});
     
  })
;
    
        
   



 
module.exports = router;
