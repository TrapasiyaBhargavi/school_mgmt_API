const mongoose=require("mongoose");

const AdminSchema=mongoose.Schema({
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

const adminmodel=mongoose.model("adminmodel",AdminSchema);

module.exports=adminmodel;