const express = require('express');
const mongoose = require('mongoose');
const auth = require('./router/auth');
const coockiParser = require('cookie-parser');
const { requireAuth, checkuser } = require('./middleware/authMiddleware')


const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(coockiParser());

// view engine
app.set('view engine', 'ejs');

// database connection
 
const dbURI = 'mongodb+srv://Bhagwat-Munde:bhagwat900@cluster0.k85vhtd.mongodb.net/MyDataBase?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(dbURI)
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.use('*',checkuser);
app.get('/',(req,res)=>{
    res.render('home');
})

app.get('/smoothies',requireAuth,(req,res)=>{
    res.render('smoothies');
})

// router
app.use(auth)

// cookies
// app.get('/set-cookie',(req,res)=>{
//   // res.setHeader('set-cookie','newUser=true');
//    res.cookie('newUser', 'false');
//    res.cookie('isEmployee',true,{ maxAge: 1000 * 60 * 60 * 24, httpOnly: true});

//   res.send("You set  the cookies successfuly")
// })

// app.get('/red-cookie',(req,res)=>{
//      const cookie=  req.cookies;
//     console.log(cookie.newUser);
//      res.json(cookie);
// })

