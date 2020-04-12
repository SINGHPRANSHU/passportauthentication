var app                  =require("express")();
var mongoose             =require("mongoose");
var passport             =require("passport");
var bodyParser           =require("body-parser");
var user                 =require("./models/user")
var localStategey        =require("passport-local");
var passportLocalMongoose=require("passport-local-mongoose");
mongoose.connect("mongodb://localhost/auth_demo_app");
app.use(bodyParser.urlencoded({extended:true}));
app.use(require("express-session")({
    secret:"node is best",
    resave:false,
    saveUninitialized:false
   
}));
app.set('view engine','ejs');
app.use(passport.initialize());
app.use(passport.session());


app.get("/",function(req,res){
   res.render("home");
});



app.get("/secret",isLoggedIn,function(req,res){
    res.render("secret");
 });


 app.get("/logout",function(req,res){
     req.logOut();
     res.redirect("/");
 });





passport.use(new localStategey(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.get("/register",function(req,res){
    res.render("register");
});


app.post("/register",function(req,res){
   user.register(new user({username:req.body.username}),req.body.password,function(err,user){
       if(err){
           console.log(err);
           return res.render("register");
       }
       passport.authenticate("local")(req,res,function(){
           res.redirect("/secret");
       });
   });
});



app.get("/login",function(req,res){
    res.render("login");
});



app.post("/login",passport.authenticate("local",{
    successRedirect:"/secret",
    failureRedirect:"/login"
}),function(req,res){

});




function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");

}



app.listen(3000,function(){
    console.log("server has started");
}); 