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
    },
    currYear:{
        type:String,
        // required:true
    },
    semester:{
        type:String,
        // required:true
    },
    academic:{
        type:String,
        // required:true
    },
    technologies:[],
    apk_views:[],
    file1:{
        type:String,
    },
    file2:{
        type:String,
    },
    file3:{
        type:String,
        default:null
    },
    repolink:{
        type:String,
        // required:true
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