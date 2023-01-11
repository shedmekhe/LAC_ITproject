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
const storage=multer.diskStorage({
    destination:async(req,file,cb)=>{
        try{
            console.log(`hello>>>>>>>+${req.body.currYear}`)
                var projectFolder0 = `./local_storage`;
                const createDir0 = await fs.mkdirSync(projectFolder0, { recursive: true });
            try{
                if(fs.existsSync(`${projectFolder0}`))
                {
                    var projectFolder=`${projectFolder0}/${req.body.currYear}`
                    const createDir=await fs.mkdirSync(projectFolder, { recursive: true });

                    try
                    {
                        if(fs.existsSync(`${projectFolder}`))
                    {
                        var projectFolder1 = `${projectFolder}/${req.body.semester}/${req.body.academic}`;
                        const createDir1 = await fs.mkdirSync(projectFolder1, { recursive: true });
                        if(fs.existsSync(`${projectFolder1}`))
                        { 
                            var projectFolder2 = `${projectFolder1}/${req.body.title}`;
                            const createDir2 = await fs.mkdirSync(projectFolder2, { recursive: true });
        
                            console.log(`${createDir}`);
                            console.log(`${createDir1}`);
                            console.log(`${createDir2}`);
                            try
                            {
                            if(fs.existsSync(`${createDir2}`))
                                cb(null,`${createDir2}/`)
                            }catch(err){
                                console.error(err);
                            }
                        }
                }
          
          
            
            }
            catch(err){
                console.error(err);
            }
            }
        }
            catch(err)
            {
                console.error(err);
            }

            

            // var projectFolder = `./local_storage/${req.body.obj}/${req.body.socialink}${req.body.socialink1}/`;

            // var projectFolder1 = `${projectFolder}/${req.body.socialink}`;
            // if(!fs.existsSync(projectFolder1))
            //     var createDir1= await fs.mkdirSync(projectFolder1, { recursive: true });

            // var projectFolder2 = `${projectFolder1}/${req.body.socialink1}/${req.body.title}/`;
            // if(!fs.existsSync(projectFolder2))
            //     var createDir2 = await fs.mkdirSync(projectFolder2, { recursive: true });
                
            // console.log(`${projectFolder}`);
            // console.log(`${projectFolder1}`);
            // console.log(`${projectFolder2}`);
            // if(fs.existsSync(`${createDir2}`))
            //     cb(null,`${createDir2}`)

            
        }
        catch (err) {
            console.error(err.message);
          }
        
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
});

const imageFileFilter=(req,file,cb)=>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null,true);
}
const upload=multer({ storage: storage,
        limits:{
            fileSize:1024*1024*5
        },
        fileFilter: imageFileFilter}).single('myfile1');


formRouter.route('/')
.get((req,res,next)=>{
    res.render("form");
})
.post( upload,async(req,res)=>{
    try{
        console.log("hello...123........");
        console.log(req.body)
        await Projects.create(
            req.body
         )   
        // if(check)
            console.log("hello.................");
        console.log("Projects Created !!");
        res.statusCode=200;
        // res.setHeader('Content-Type','application/json')
        res.render("info");
    }
    catch (e){
        res.status(400).send(e)
        console.log(e);
     }
});

module.exports=formRouter;
// {   
//     title:req.body.title,
//     obj:req.body.obj,
//     myfile:req.body.myfile,
//     myfile1:req.myfile1.filename,
//     yname:req.body.yname,
//     email:req.body.email,
//     socialink:req.body.socialink,
//     socialink1:req.body.socialink1,
//     gname:req.body.gname,
//     technologies:req.body.technologies,
//     apk_views:req.body.apk_views,
//     vid1:req.body.vid1,
//     repolink:req.body.repolink,
//     weblink:req.body.weblink,
//     apkf:req.body.apkfs,
//     }