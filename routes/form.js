const express =require('express');
const router=express.Router();
const Projects=require('../models/project_details');
const path=require('path');
const app=express();
const fs=require('fs'); 
const User = require('../models/userModel')
const  multer=require('multer');
const { loginrequired } = require('../config/JWT');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      try
      {
        if (file.fieldname === "file1") {
          cb(null, "local_storage/file1Data");
        } else if (file.fieldname === "file2") {
          cb(null, "local_storage/file2Data");
        } else if (file.fieldname === "file3") {
          cb(null, "local_storage/file3Data");
        }
      }
      catch(err){
        console.log("Error while Uploading")
      }
    },
      filename: function (req, file, cb) {
        cb(
          null,
          file.originalname
          // file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        ); //Appending extension
      }
      });
  
  const maxSize = 400 * 1024 * 1024; //400Mb size
  const upload = multer({
    storage:storage,
    fileFilter: (req, file, cb) => {
      if (file.fieldname === "file1") {
        if (
          file.mimetype === "application/pdf"
        ) {
          cb(null, true);
        } else {
          req.flash('report-error',"Report should be in .pdf or .docx format");
         
          cb(null, false);
        }
      } else if (file.fieldname === "file2") {
        if (
          file.mimetype == "image/png" ||
          file.mimetype == "image/jpg" ||
          file.mimetype == "image/jpeg"
        ) {
          cb(null, true);
        } else {
          req.flash('poster-error',"Poster should be in .jpeg or .jpg or .png format");
         
          cb(null, false);
          return cb(new Error("Only .png .jpg .jpeg format allowed !!"));
        }
      } else if (file.fieldname === "file3") {
        if (file.mimetype == "video/mkv" || file.mimetype == "video/mp4") {
          cb(null, true);
        } else {
          req.flash('video-error',"Video should be in .mp4 or .mkv format");
          // res.redirect('/form');
          cb(null, false);
          return cb(new Error("Only .mp4 .mkv format allowed !!"));
        }
      }
    },
    limits: { fileSize: maxSize },
  });
  var multipleUpload = upload.fields([
    { name: "file1", maxCount: 1 },
    { name: "file2", maxCount: 3 },
    { name: "file3", maxCount: 1 },
  ]);

router.get('/',loginrequired,(req,res)=>{
  const poster_error = req.flash('poster-error');
  const video_error = req.flash('video-error');
  const report_error = req.flash('report-error');
  const title_error = req.flash('title-error')
  res.render("form/form",{poster_error,video_error,report_error,title_error});
})


router.post('/',multipleUpload,async(req,res)=>{
        if(req.files){   
          let file0=req.files.file1[0];
          let pdfog=file0.originalname;

          let file=req.files.file2[0];
          let originalname=file.originalname;
          
          let file3=req.files.file3[0];
          let vidog=file3.originalname;
          
            var academic = req.body.academic;
            var year = req.body.currYear;
            var semester = req.body.semester;
            var projTitle=req.body.title;
            const path = `local_storage/${year}/${semester}/${academic}/${projTitle}/`;
            
            var file2path=`${year}/${semester}/${academic}/${projTitle}/`+'file2/'+`${originalname}`;
            var file1path=`${year}/${semester}/${academic}/${projTitle}/`+'file1/'+`${pdfog}`;
            var file3path=`${year}/${semester}/${academic}/${projTitle}/`+'file3/'+`${vidog}`;
           
        fs.access(path, (error) => {
        
    // To check if given directory 
    // already exists or not
    if (error) {
        // If current directory does not exist then create it
        fs.mkdir(path + 'file1/', { recursive: true }, (error) => {
          if (error) {
            console.log(error);
          } else {
            fs.readdirSync('local_storage/file1Data').forEach(file =>{
              fs.renameSync('local_storage/file1Data/' + file, path  + 'file1/' +file)
            })
          }
        })
  
        fs.mkdir(path + 'file2/', { recursive: true }, (error) => {
          if (error) {
            console.log(error);
          } else {
            fs.readdirSync('local_storage/file2Data').forEach(file =>{
              fs.renameSync('local_storage/file2Data/' + file, path  + 'file2/'+file)
            })
          }
        })
  
        fs.mkdir(path + 'file3/', { recursive: true }, (error) => {
          if (error) {
            console.log(error);
          } else {
            fs.readdirSync('local_storage/file3Data').forEach(file =>{
              fs.renameSync('local_storage/file3Data/' + file, path + 'file3/' + file)
            })
          }
        })
      } else {
        console.log("Given Directory already exists !!");
        fs.readdirSync('local_storage/file1Data').forEach(file =>{
        fs.renameSync('local_storage/file1Data/' + file, path  + 'file1/' + file)});
  
        fs.readdirSync('local_storage/file2Data').forEach(file =>{
        fs.renameSync('local_storage/file2Data/' + file, path  + 'file2/'+ file)});
  
        fs.readdirSync('local_storage/file3Data').forEach(file =>{
        fs.renameSync('local_storage/file3Data/' + file, path  + 'file3/'+ file)});
  
      }
    });
    
    const checkTitle = await Projects.findOne({title:req.body.title});
    if(checkTitle)
    {
      req.flash('title-error',"Title of project should be unique");
      res.redirect('/form');
    }
    
    await Projects.create(
      {
        file1:`${file1path}`,
        file2:`${file2path}`,
        file3:`${file3path}`,
        title:req.body.title,
        email:req.body.email,
        obj:req.body.obj,
        repolink:req.body.repolink,
        currYear:req.body.currYear,
        semester:req.body.semester,
        academic:req.body.academic,
        currentDate: "0"
      })
      let cuser = await Projects.findOne({title:req.body.title});
      
      let cdate = cuser.createdAt;
      await Projects.updateOne( { title: req.body.title },
      {
        $set: {
        currentDate: cdate.toJSON().slice(0, 10)
        }
      });

      
}
    else
    {
        res.redirect('/home');
    }
    try
    {
        // console.log("Projects Created !!");
        res.statusCode=200;
        res.redirect('/home');
      }
        catch(err)
        {
            res.redirect('/home');
        }
        
   
});

module.exports=router;
