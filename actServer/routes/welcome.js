var express = require('express');
var router = express.Router();
const bodyParser=require('body-parser');
const projects  = require('../models/project_details')
const path=require('path');
const info_path=path.join(__dirname,'views/HomePage')
const app = express();
app.set("view engine","hbs")
app.set("views",info_path);
app.use(express.static(path.join(__dirname,'./public/')))
router.use(bodyParser.json());
/* GET home page. */
router.get('/', (req, res)=>{
        res.render('welcome');
});

module.exports = router;
