var express = require('express');
const User = require('../models/userModel');
var router = express.Router();
const bodyParser=require('body-parser');
const projects  = require('../models/project_details')
const path=require('path');
const info_path=path.join(__dirname,'views/HomePage')
const { loginrequired } = require('../config/JWT');
const app = express();
app.set("view engine","hbs")
app.set("views",info_path);
app.use(express.static(path.join(__dirname,'./public/')))
router.use(bodyParser.json());
/* GET home page. */
router.get('/',loginrequired,  async(req, res, next)=>{
  let _id=res.user;
    let curr_user =User.findOne({_id}).then((msg) =>{
        let email=msg.email
        console.log("sbjabjdbs....."+email)
        let userData= projects.findOne({email:email})
        .then((proj)=>{
          console.log('.....'+proj);
  //         // var tmp = [];
  //         // proj.map((p)=>{  //         //   tmp.push(p.yname)
  //         // })
  //           // let len = proj["technologies"].length;
  //           // res.statusCode=200;
  //           // res.setHeader('Content-Type','application/json')
  //           // console.log(prij.title)
  //           // console.log(len);
            res.render('dashb',{proj:proj});
  //           // res.json(dishes);
            
        },(err)=>next(err))
        .catch((err)=>next(err));
  })
});
    
        
   



 
module.exports = router;
