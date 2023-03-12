const mongoose=require('mongoose');
const Schema=mongoose.Schema

const detailSchema=new Schema({
    title:{
        type:String,
        unique:true,
        required:true
    },
    email:{
        type:String
    },
    obj:{
        type:String,
    },
    file1:{
        type:String,
    },
    file2:{
        type:String,
    },
    file3:{
        type:String,
    },
    currYear:{
        type:String,
    },
    academic:{
        type:String,
    },
    semester:{
        type:String,
    },
    repolink:{
        type:String,
    },
    technologies: {
        type: [String],
        required: true
     },
    currentDate:{
        type:String
    },
   

}, {
        timestamps:true
    }
)


var Projects=mongoose.model('Project',detailSchema);
module.exports=Projects;