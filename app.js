//jshint esversion:6

require('dotenv').config();
const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const md5=require('md5');

const app=express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('Public'));

mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema=new mongoose.Schema({
    userName:String,
    password:String,
});


const User=mongoose.model("User",userSchema);


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
        password:md5(req.body.password)
    });
    console.log(newUser);
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