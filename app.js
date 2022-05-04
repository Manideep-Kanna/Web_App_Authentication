//jshint esversion:6

const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');

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

const saltRounds=10;


app.get('/',(req,res)=>{
    res.render('home');
});

app.get('/login',(req,res)=>{
    res.render('login');
});

app.post('/login',(req,res)=>{
    const reqUserName=req.body.username;
    const password=req.body.password;

    User.findOne({userName:reqUserName},(err,foundUser)=>{
        if(err){
            console.log(err);
        }
        else{
            if(foundUser){
                bcrypt.compare(password,foundUser.password,(err,result)=>{
                    if(result===true){
                        res.render('secrets');
                    }
                })
            }
        }
    })
})

app.get('/register',(req,res)=>{
    res.render('register');
})

app.post('/register',(req,res)=>{

    bcrypt.hash(req.body.password,saltRounds,(err,hash)=>{
        const newUser=new User({
            userName:req.body.username,
            password:hash
        });
        newUser.save((err)=>{
            if(err){
                console.log(err);
            }
            else{
                res.render('secrets');
            }
        });

    })


});

app.listen(3000,()=>{
    console.log('server is listening in PORT 3000');
})