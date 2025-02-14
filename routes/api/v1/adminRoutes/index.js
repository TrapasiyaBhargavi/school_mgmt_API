const express=require("express");

const routes=express.Router();

const adminctl=require("../../../../controller/api/v1/admincontroller");

const passport=require("passport")

routes.post("/adminregister",adminctl.adminregister);

routes.post("/adminlogin",adminctl.adminlogin);

routes.get("/adminprofile",passport.authenticate('jwt',{failureRedirect:'/api/adminfailtoken'}),adminctl.adminprofile);

routes.get("/adminfailtoken",(req,res)=>{
    try{
        return res.status(401).json({msg:'Invalid token'})
    }
    catch{
        return res.status(400).json({msg:'somthing is wrong'})
    }
})

routes.put("/editadminprofile/:id",passport.authenticate('jwt',{failureRedirect:'/api/adminfailtoken'}),adminctl.editadminprofile);

routes.post("/changepassword",passport.authenticate('jwt',{failureRedirect:'/api/adminfailtoken'}),adminctl.changepassword);

routes.get("/adminlogout",passport.authenticate('jwt',{failureRedirect:'/api/adminfailtoken'}),adminctl.adminlogout);

routes.post("/checkemail",adminctl.checkemail);

routes.post("/updatepassword",adminctl.updatepassword);

routes.post("/facultyregister",adminctl.facultyregister)

module.exports=routes;