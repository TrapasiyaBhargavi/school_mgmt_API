const adminmodel=require("../../../model/adminmodel");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken")
module.exports.adminregister=async(req,res)=>{
    try{
        
       let checkemailexit=await adminmodel.findOne({email:req.body.email})
       if(!checkemailexit){
            if(req.body.password==req.body.confirmpassword){
                req.body.password=await bcrypt.hash(req.body.password,10)
                let checkadmin=await adminmodel.create(req.body);
                if(checkadmin){
                    return res.status(200).json({msg:'admin data add sucefully',record:checkadmin})
                   
                }
                else{
                    return res.status(200).json({msg:'admin data not found'})
                }
            }
            else{
                return res.status(200).json({msg:'password and confirmpassword are not match'})
            }
       }
       else{
        return res.status(200).json({msg:'admin email is exit'})
       }
    }
    catch{
        return res.status(400).json({msg:'somthing is wrong'})
    }
}

module.exports.adminlogin=async(req,res)=>{
    try{
        let checkemail=await adminmodel.findOne({email:req.body.email});
        if(checkemail){
            let checkpassword=await bcrypt.compare(req.body.password,checkemail.password);
            
            if(checkpassword){
            checkemail = checkemail.toObject();
            delete checkemail.password;
            console.log("delete",checkemail);
                let admintoken=await jwt.sign({admindata:checkemail},"Rnw",{expiresIn:'1d'});
                if(admintoken){
                    return res.status(400).json({msg:'data login sucefully',admintoken:admintoken})
                
                }
                else{
                    return res.status(200).json({msg:'data not found'})
                }
            }
            else{
                return res.status(200).json({msg:'Invalid password'})
            }
        }
        else{
            return res.status(200).json({msg:'Invalid email'})
        
        }
    }
    catch{
        return res.status(400).json({msg:'somthing is wrong'})
    }
}

module.exports.adminprofile=async(req,res)=>{
    try{
        return res.status(200).json({msg:'user information',data:req.user})
    }
    catch{
        return res.status(400).json({msg:'somthing is wrong'})
    }
}

module.exports.editadminprofile=async(req,res)=>{
    try{
    //    console.log(req.params.id);
    //    console.log(req.body);
    let checkAdminId=await adminmodel.findById(req.params.id);
    if(checkAdminId){
        let editadmin=await adminmodel.findByIdAndUpdate(req.params.id,req.body);
        if(editadmin){
            let updateprofile=await adminmodel.findById(req.params.id);

            return res.status(400).json({msg:'Admin data profile succefully',data:updateprofile})

        }
        else{
                 return res.status(400).json({msg:'Admin data not profile succefully'})
        }
    }
    else{
        return res.status(200).json({msg:'data not found'})
    }
    }
    catch{
        return res.status(400).json({msg:'somthing is wrong'})
    }
}

module.exports.changepassword=async(req,res)=>{
    try{
        let checkcurrentpwd=await bcrypt.compare(req.body.currentpwd,req.user.password);
        if(checkcurrentpwd){
            if(req.body.currentpwd!=req.body.newpwd){
                if(req.body.newpwd==req.body.confirmpwd){
                    req.body.password=await bcrypt.hash(req.body.newpwd,10)
                    let upadatepassword=await adminmodel.findByIdAndUpdate(req.user._id,req.body);
                    if(upadatepassword){
                        return res.status(200).json({msg:'password change sucefully',upadatepassword});
                    }
                    else{
                        return res.status(200).json({msg:'password not chage'})
                    }
                }
                else{
                    return res.status(200).json({msg:'new pwd and confirm pwd not match'})
                }
            }
            else{
                return res.status(200).json({msg:'current pwd and new pwd match!try again'})
            }
        }
        else{
            return res.status(200).json({msg:'Invalid password'})
        }
    }catch{
        return res.status(400).json({msg:'somthing is wrong'})
    }
}

module.exports.adminlogout=async(req,res)=>{
    try{
        req.session.destroy((err)=>{
            if(err){
                return res.status(400).json({msg:'somthing is wrong'})
            }
            else{
                return res.status(200).json({msg:'go to adminlogin'})
            }
        })
    }
    catch{
        return res.status(400).json({msg:'somthing is wrong'})
    }
}