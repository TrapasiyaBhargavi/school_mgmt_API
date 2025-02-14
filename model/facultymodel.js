const mongoose=require("mongoose");

const FacultySchema=mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

const facultymodel=mongoose.model("facultymodel",FacultySchema);

module.exports=facultymodel;