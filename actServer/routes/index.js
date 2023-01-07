var express = require('express');
var router = express.Router();
const bodyParser=require('body-parser');
const projects  = require('../models/project_details')
const path=require('path');
const { loginrequired } = require('../config/JWT');
const info_path=path.join(__dirname,'views/HomePage')
const app = express();
app.set("view engine","hbs")
app.set("views",info_path);
app.use(express.static(path.join(__dirname,'./public/')))
router.use(bodyParser.json());

/* GET home page. */
router.get('/',loginrequired,async(req, res, next)=>{
  const userData=await projects.find({})
    .then((proj)=>{
      // console.log(proj);
      // var tmp = [];
      // proj.map((p)=>{
      //   tmp.push(p.myfile1)
      // })
        // let len = proj["technologies"].length;
        // res.statusCode=200;
        // res.setHeader('Content-Type','application/json')
        // console.log(prij.title)
        // console.log(len);
        res.render('index',{proj:proj});
        // res.json(dishes);
        
    },(err)=>next(err))
    .catch((err)=>next(err));
});

router.get('/welcome',(req,res)=>{
  res.render('welcome')
});

router.get('/logout',(req,res)=>{
  res.cookie('access-token',"",{maxAge: 1 })
  res.redirect('user/login');
})

module.exports = router;
