//jshint esversion:6

const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema={
    userName:String,
    password:String,
};

const User=mongoose.model("User",userSchema);

const app=express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('Public'));


app.get('/',(req,res)=>{
    res.render('home');
});

app.get('/login',(req,res)=>{
    res.render('login');
});

app.post('/login',(req,res)=>{
    const reqUserName=req.body.username;
    const password=req.body.password;

    User.findOne({userName:reqUserName},(err,user)=>{
        if(err){
            console.log(err);
        }
        else{
            if(user){
                console.log(user);
                if(user.password===password){
                    res.render('secrets');
                }
                else{
                    res.send("Not Found the USER Name");
                }
            }
        }
    })
})

app.get('/register',(req,res)=>{
    res.render('register');
})

app.post('/register',(req,res)=>{

    const newUser=new User({
        userName:req.body.username,
        password:req.body.password
    });

    newUser.save((err)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render('secrets');
        }
    });
});

app.listen(3000,()=>{
    console.log('server is listening in PORT 3000');
})