const adminmodel=require("../../../model/adminmodel");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const nodemailer = require("nodemailer");
const facultymodel=require("../../../model/facultymodel")
module.exports.adminregister=async(req,res)=>{
    try{
        console.log(req.body);
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

module.exports.checkemail=async(req,res)=>{
    try{
        let checkemail=await adminmodel.findOne({email:req.body.email});
        if(checkemail){
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                  user: "bhargavitrapasiya12@gmail.com",
                  pass: "izhyykkpuwdpqjqk",
                },
                tls:{
                    rejectUnauthorized:false
                }
              });

              let otp=(Math.floor(Math.random()*100000));
            
                // send mail with defined transport object
                const info = await transporter.sendMail({
                  from: 'bhargavitrapasiya12@gmail.com', // sender address
                  to: req.body.email, // list of receivers
                  subject: "Hello ✔", // Subject line
                  text: "Your login detail", // plain text body
                  html: `<b>OTP:${otp}</b>`, // html body
                });
              
                console.log("Message sent:");

                const data={
                    email:req.body,otp
                }

                if(info){
                    return res.status(200).json({msg:'otp sened sucefully',data:data})
                }
                else{
                    return res.status(200).json({msg:'otp not sened sucefully',data:info})
                }
                // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
              
        }
        else{
            return res.status(400).json({msg:'Invalid email'})
        }
    }
    catch{
        return res.status(400).json({msg:'somthing is wrong'})
    }
}

module.exports.updatepassword=async(req,res)=>{
    try{
        let checkemail=await adminmodel.findOne({email:req.query.email})
        if(checkemail){
            if(req.body.newpassword==req.body.confirmpassword){
                req.body.password=await bcrypt.hash(req.body.newpassword,10);
                let updatepass=await adminmodel.findByIdAndUpdate(checkemail._id,req.body);
                if(updatepass){
                    return res.status(200).json({msg:'password change sucefully'})
                }
                else{
                    return res.status(400).json({msg:'password not change sucefully'})
                }

            }
            else{
                return res.status(200).json({msg:'new and confirm password are not match'})
            }
        }
    }
    catch{
        return res.status(400).json({msg:'somthing is wrong'})
    }
}

module.exports.facultyregister=async(req,res)=>{
    try{
       let exitemail=await facultymodel.findOne({email:req.body.email});
       if(!exitemail){
        var gpass=generatePassword();
        var link="http://localhost:8001/api";
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for port 465, false for other ports
            auth: {
              user: "bhargavitrapasiya12@gmail.com",
              pass: "izhyykkpuwdpqjqk",
            },
            tls:{
                rejectUnauthorized:false
            }
          });
         
            
                // send mail with defined transport object
                const info = await transporter.sendMail({
                  from: 'bhargavitrapasiya12@gmail.com', // sender address
                  to: req.body.email, // list of receivers
                  subject: "Hello ✔", // Subject line
                  text: "Your login detail", // plain text body
                  html: `<h1>Your login detail</h1><p>email:${req.body.email}</p><p>password:${gpass}</p><p>for login click here:${link}</p>`, // html body
                });
              
              if(info){
                let ecryptpass=await bcrypt.hash(gpass,10)
                let addfaculty=await facultymodel.create({email:req.body.email,password:ecryptpass,username:req.body.username})
                if(addfaculty){
                    return res.status(200).json({msg:'check your mail for login',data:addfaculty})
                }
                else{
                    return res.status(400).json({msg:'faculty not register'})
                }
              }

       }
       else{
        return res.status(200).json({msg:'email is already exit'})
       }
    }
    catch{
        return res.status(400).json({msg:'somthing is wrong'})
    }
}

function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}