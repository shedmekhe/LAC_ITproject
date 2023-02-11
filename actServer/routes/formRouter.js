const express =require('express');
const bodyParser=require('body-parser');
const formRouter=express.Router();
const Projects=require('../models/project_details');
const path=require('path');
const home_path=path.join(__dirname,'views/HomePage')
const app=express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'./public/')))
app.set("view engine","hbs")
app.set("views",home_path);
const fs=require('fs'); 
const  multer=require('multer');
const { title } = require('process');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      try
      {
        console.log("Reached destination")
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
  
  // const maxSize = 700 * 1024 * 1024; //700Mb size
  const upload = multer({
    storage:storage,
    fileFilter: (req, file, cb) => {
      if (file.fieldname === "file1") {
        if (
          file.mimetype === "application/pdf" ||
          file.mimetype === "application/msword"
        ) {
          cb(null, true);
        } else {
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
          cb(null, false);
          return cb(new Error("Only .png .jpg .jpeg format allowed !!"));
        }
      } else if (file.fieldname === "file3") {
        if (file.mimetype == "video/mkv" || file.mimetype == "video/mp4") {
          cb(null, true);
        } else {
          cb(null, false);
          return cb(new Error("Only .mp4 .mkv format allowed !!"));
        }
      }
    }
    // limits: { fileSize: maxSize },
  });
  var multipleUpload = upload.fields([
    { name: "file1", maxCount: 1 },
    { name: "file2", maxCount: 3 },
    { name: "file3", maxCount: 1 },
  ]);

formRouter.route('/')
.get((req,res,next)=>{
    res.render("form1");
})
.post(multipleUpload,async(req,res)=>{
        if(req.files){   
          console.log(req.files)
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
            console.log(path)
            console.log("at middle")
        fs.access(path, (error) => {
        
    // To check if given directory 
    // already exists or not
    if (error) {
        // If current directory does not exist then create it
        fs.mkdir(path + 'file1/', { recursive: true }, (error) => {
          if (error) {
            console.log(error);
          } else {
            console.log("New Directory created successfully !!");
  
            fs.readdirSync('local_storage/file1Data').forEach(file =>{
              fs.renameSync('local_storage/file1Data/' + file, path  + 'file1/' +file)
            })
          }
        })
  
        fs.mkdir(path + 'file2/', { recursive: true }, (error) => {
          if (error) {
            console.log(error);
          } else {
            console.log("New Directory created successfully !!");
  
            fs.readdirSync('local_storage/file2Data').forEach(file =>{
              fs.renameSync('local_storage/file2Data/' + file, path  + 'file2/'+file)
            })
          }
        })
  
        fs.mkdir(path + 'file3/', { recursive: true }, (error) => {
          if (error) {
            console.log(error);
          } else {
            console.log("New Directory created successfully !!");
  
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
    await Projects.create(
      {
        file1:`${file1path}`,
        file2:`${file2path}`,
        file3:`${file3path}`,
        title:req.body.title,
        currYear:req.body.currYear,
        semester:req.body.semester,
        academic:req.body.academic
      }
    );
}
    else
    {
        console.log("Reached end ....")
        res.redirect('/');
    }
        try
    {
        console.log("Projects Created !!");
        res.statusCode=200;
        // res.setHeader('Content-Type','application/json')
        res.redirect('/');
      }
        catch(err)
        {
            res.redirect('/');
        }
        
   
});

module.exports=formRouter;
// {   
//     title:req.body.title,
//     obj:req.body.obj,
//     file1:req.body.file1,
//     file2:req.file2.filename,
//     yname:req.body.yname,
//     email:req.body.email,
//     socialink:req.body.socialink,
//     socialink1:req.body.socialink1,
//     gname:req.body.gname,
//     technologies:req.body.technologies,
//     apk_views:req.body.apk_views,
//     file3:req.body.file3,
//     repolink:req.body.repolink,
//     weblink:req.body.weblink,
//     apkf:req.body.apkfs,
//     }








// const express =require('express');
// const bodyParser=require('body-parser');
// const formRouter=express.Router();
// const Projects=require('../models/project_details');
// const path=require('path');
// const home_path=path.join(__dirname,'views/HomePage')
// const app=express();
// app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname,'./public/')))
// app.set("view engine","hbs")
// app.set("views",home_path);
// const fs=require('fs'); 
// const  multer=require('multer');
// const storage=multer.diskStorage({
//     destination:async(req,file,cb)=>{
//         try{
//             console.log(`hello>>>>>>>+${req.body.currYear}`)
//                 var projectFolder0 = `./local_storage`;
//                 const createDir0 = await fs.mkdirSync(projectFolder0, { recursive: true });
//             try{
//                 if(fs.existsSync(`${projectFolder0}`))
//                 {
//                     var projectFolder=`${projectFolder0}/${req.body.currYear}`
//                     const createDir=await fs.mkdirSync(projectFolder, { recursive: true });

//                     try
//                     {
//                         if(fs.existsSync(`${projectFolder}`))
//                     {
//                         var projectFolder1 = `${projectFolder}/${req.body.semester}/${req.body.academic}`;
//                         const createDir1 = await fs.mkdirSync(projectFolder1, { recursive: true });
//                         if(fs.existsSync(`${projectFolder1}`))
//                         { 
//                             var projectFolder2 = `${projectFolder1}/${req.body.title}`;
//                             const createDir2 = await fs.mkdirSync(projectFolder2, { recursive: true });
        
//                             console.log(`${createDir}`);
//                             console.log(`${createDir1}`);
//                             console.log(`${createDir2}`);
//                             try
//                             {
//                             if(fs.existsSync(`${createDir2}`))
//                                 cb(null,`${createDir2}/`)
//                             }catch(err){
//                                 console.error(err);
//                             }
//                         }
//                 }
          
          
            
//             }
//             catch(err){
//                 console.error(err);
//             }
//             }
//         }
//             catch(err)
//             {
//                 console.error(err);
//             }

            

//             // var projectFolder = `./local_storage/${req.body.obj}/${req.body.socialink}${req.body.socialink1}/`;

//             // var projectFolder1 = `${projectFolder}/${req.body.socialink}`;
//             // if(!fs.existsSync(projectFolder1))
//             //     var createDir1= await fs.mkdirSync(projectFolder1, { recursive: true });

//             // var projectFolder2 = `${projectFolder1}/${req.body.socialink1}/${req.body.title}/`;
//             // if(!fs.existsSync(projectFolder2))
//             //     var createDir2 = await fs.mkdirSync(projectFolder2, { recursive: true });
                
//             // console.log(`${projectFolder}`);
//             // console.log(`${projectFolder1}`);
//             // console.log(`${projectFolder2}`);
//             // if(fs.existsSync(`${createDir2}`))
//             //     cb(null,`${createDir2}`)

            
//         }
//         catch (err) {
//             console.error(err.message);
//           }
        
//     },
//     filename:(req,file,cb)=>{
//         cb(null,file.originalname)
//     }
// });

// const imageFileFilter=(req,file,cb)=>{
//     if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
//         return cb(new Error('You can upload only image files!'), false);
//     }
//     cb(null,true);
// }
// const upload=multer({ storage: storage,
//         limits:{
//             fileSize:1024*1024*5
//         },
//         fileFilter: imageFileFilter}).single('file2');


// formRouter.route('/')
// .get((req,res,next)=>{
//     res.render("form");
// })
// .post(upload,async(req,res)=>{
//     try{
//         console.log("hello...123........");
//         console.log(req.body)
//         await Projects.create(
//             req.body
//          )   
//         // if(check)
//         console.log("hello.................");
//         console.log("Projects Created !!");
//         res.statusCode=200;
//         // res.setHeader('Content-Type','application/json')
//         res.render("info");
//     }
//     catch (e){
//         res.status(400).send(e)
//         console.log(e);
//      }
// });

// module.exports=formRouter;
// // {   
// //     title:req.body.title,
// //     obj:req.body.obj,
// //     file1:req.body.file1,
// //     file2:req.file2.filename,
// //     yname:req.body.yname,
// //     email:req.body.email,
// //     socialink:req.body.socialink,
// //     socialink1:req.body.socialink1,
// //     gname:req.body.gname,
// //     technologies:req.body.technologies,
// //     apk_views:req.body.apk_views,
// //     file3:req.body.file3,
// //     repolink:req.body.repolink,
// //     weblink:req.body.weblink,
// //     apkf:req.body.apkfs,
// //     }





