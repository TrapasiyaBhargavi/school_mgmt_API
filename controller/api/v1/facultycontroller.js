const facultymodel=require("../../../model/facultymodel");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const nodemailer = require("nodemailer");
module.exports.facultylogin=async(req,res)=>{
    try{
       let checkfacultyemail=await facultymodel.findOne({email:req.body.email});
       if(checkfacultyemail){
        let checkpassword=await bcrypt.compare(req.body.password,checkfacultyemail.password);
        if(checkpassword){
            checkfacultyemail = checkfacultyemail.toObject();
            delete checkfacultyemail.password;
            console.log("delete",checkfacultyemail);
            let facultytoken=await jwt.sign({ft:checkfacultyemail},"FRNW",{expiresIn:"1h"});
            if(facultytoken){
                return res.status(200).json({msg:'faculty login sucefully',facultytoken:facultytoken})
            }
            else{
                return res.status(200).json({msg:'faculty login not sucefully'})
            }
        }
        else{
            return res.status(200).json({msg:'Invalid password'})
        }
       }
       else{
         return res.status(200).json({msg:'Invalid Email'})
       }
    }
    catch{
        return res.status(400).json({msg:'somthing is wrong'})
    }
}

module.exports.facultyprofile=async(req,res)=>{
    try{
        return res.status(200).json({msg:'faculty information',data:req.user})
    }
    catch{
        return res.status(400).json({msg:'somthing is wrong'})
    }
}

module.exports.facultyeditprofile=async(req,res)=>{
    try{
        // console.log(req.params.id);
        // console.log(req.body)

        let checkemailId=await facultymodel.findById(req.params.id);
        if(checkemailId){
            let editfaculty=await facultymodel.findByIdAndUpdate(req.params.id,req.body);
            if(editfaculty){
                let updatefaculty=await facultymodel.findById(req.params.id);
                return res.status(200).json({msg:'faculty data profile succefully',data:updatefaculty})

            }
            else{
                return res.status(200).json({msg:'faculty data not profile succefully'})
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

module.exports.facultychangepassword=async(req,res)=>{
    try{
        let checkcurrent=await bcrypt.compare(req.body.currentpassword,req.user.password);
        if(checkcurrent){
            if(req.body.currentpassword!=req.body.newpassword){
                if(req.body.newpassword==req.body.confirmpassword){
                    req.body.password=await bcrypt.hash(req.body.newpassword,10)
                    let updatepassword=await facultymodel.findByIdAndUpdate(req.user._id,req.body);
                    if(updatepassword){
                        return res.status(200).json({msg:'password change sucefully',updatepassword});
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
            return res.status(200).json({msg:'Invalid Password'})
        }
    }
    catch{
        return res.status(400).json({msg:'somthing is wrong'})
    }
}

module.exports.checkfacultyemail=async(req,res)=>{
    try{
        let facultycheckemail=await facultymodel.findOne({email:req.body.email});
          if(facultycheckemail){
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

                const facultydata={
                    email:req.body,otp
                }

                if(info){
                    return res.status(200).json({msg:'otp sened sucefully',facultydata:facultydata})
                }
                else{
                    return res.status(200).json({msg:'otp not sened sucefully',facultydata:info})
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

module.exports.updatefacultypassword=async(req,res)=>{
    try{
        let facultycheckemail=await facultymodel.findOne({email:req.query.email})
        if(facultycheckemail){
            if(req.body.newpassword==req.body.confirmpassword){
                req.body.password=await bcrypt.hash(req.body.newpassword,10);
                let facultyupdatepass=await facultymodel.findByIdAndUpdate(facultycheckemail._id,req.body);
                if(facultyupdatepass){
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

module.exports.facultylogout=async(req,res)=>{
    try{
        req.session.destroy((err)=>{
            if(err){
                return res.status(400).json({msg:'somthing is wrong'})
            }
            else{
                return res.status(200).json({msg:'go to facultylogin'})
            }
        })
    }
    catch{
        return res.status(400).json({msg:'somthing is wrong'})
    }
}
