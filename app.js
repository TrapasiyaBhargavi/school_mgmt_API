const express=require("express");

const port=8001;

const app=express();

// const db=require("./config/db");

const mongoose=require("mongoose");

mongoose.connect("mongodb+srv://bhargavitrapasiya12:OTUnLTQlfQAxcUJ2@cluster0.djlmy.mongodb.net/schoolmgmt",{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then((res)=>{
    console.log("db is connected");
})
.catch((err)=>{
    console.log("db is not connected")
})

const passport=require("passport");
const jwtStrategy=require("./config/passport-jwt");
const session=require("express-session")

app.use(express.urlencoded())

app.use(session({
    name:"jwtapi",
    secret:"Rnw1",
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*60
    }


}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api",require("./routes/api/v1/adminRoutes"));

app.listen(port,(err)=>{
    if(err){
        console.log("error");
        return false
    }
    console.log("server is start:"+port)
})