const passport=require("passport");

const jwtStrategy=require("passport-jwt").Strategy;

const ExtractJwt=require("passport-jwt").ExtractJwt;

const opts={
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:"Rnw"
}

const adminmodel=require("../model/adminmodel")

passport.use(new jwtStrategy(opts ,async function(payload,done){
    let checkadminemail=await adminmodel.findOne({email:payload.admindata.email});
    if(checkadminemail){
        return done(null,checkadminemail)
    }
    else{
        return done(null,false)
    }
}))

const facultyopts={
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:"FRNW"
}

const facultymodel=require("../model/facultymodel");

passport.use('faculty', new jwtStrategy(facultyopts ,async function(payload,done){
    let checkfacultyemail=await facultymodel.findOne({email:payload.ft.email});
    if(checkfacultyemail){
        return done(null,checkfacultyemail)
    }
    else{
        return done(null,false)
    }
}))

passport.serializeUser((user,done)=>{
    return done(null,user.id)
})

passport.deserializeUser(async(id,done)=>{
    let admindata=await adminmodel.findById(id);
    if(admindata){
        return done(null,admindata)
    }
    else{
        return done(null,false)
    }
})

module.exports=passport;