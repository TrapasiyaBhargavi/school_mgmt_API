const expres=require("express");

const routes=expres.Router();

const passport=require("passport")

const facultyCtl=require("../../../../controller/api/v1/facultycontroller");

routes.post("/facultylogin",facultyCtl.facultylogin);



routes.get("/facultyprofile",passport.authenticate('faculty',{failureRedirect:'/api/faculty/facultyfailtoken'}),facultyCtl.facultyprofile);
routes.get('/facultyfailtoken',(req,res)=>{
    try{
        return res.status(401).json({msg:'Invalid Token'})
    }
    catch{
        return res.status(400).json({msg:'somthing is worng'})
    }
})

routes.put("/facultyeditprofile/:id",passport.authenticate('faculty',{failureRedirect:'/api/faculty/facultyfailtoken'}),facultyCtl.facultyeditprofile);

routes.post("/facultychangepassword",passport.authenticate('faculty',{failureRedirect:'/api/faculty/facultyfailtoken'}),facultyCtl.facultychangepassword);

routes.post("/checkfacultyemail",facultyCtl.checkfacultyemail);

routes.post("/updatefacultypassword",facultyCtl.updatefacultypassword);

routes.get("/facultylogout",passport.authenticate('faculty',{failureRedirect:'/api/faculty/facultyfailtoken'}),facultyCtl.facultylogout)

module.exports=routes;