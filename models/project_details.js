const mongoose=require('mongoose');
const Schema=mongoose.Schema

const detailSchema=new Schema({
    title:{
        type:String,
        unique:true,
        required:true
    },
    obj:{
        type:String,
        required:true
    },
    myfile:{
        type:String,
    },
    myfile1:{
        type:String,
        // default:"https://drive.google.com/file/d/1WWQrD7PDI3YC_7NwOzWGsjGjrLGl6Sy5/view?usp=share_link"
        // required:true
    },
    yname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    socialink:{
        type:String,
        required:true
    },
    socialink1:{
        type:String,
        required:true
    },
    gname:{
        type:String,
    },
    // {{type:String}}
    technologies:[],
    apk_views:[],
    vid1:{
        type:String,
        default:null
    },
    repolink:{
        type:String,
        required:true
    },
    weblink:{
        type:String
    },
    apkf:{
        type:String
    },
    

}, {
        timestamps:true
    }
)
var Projects=mongoose.model('Project',detailSchema);
module.exports=Projects;