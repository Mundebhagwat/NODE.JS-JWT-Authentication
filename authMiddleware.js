const jwt = require('jsonwebtoken');
const User = require('../model/User')

const requireAuth = (req,res,next)=>{
     const token = req.cookies.jwt;
     if(token){
        jwt.verify(token,'my secrate key',(err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/login')
            }else{
                console.log(decodedToken.id);
                next();
            }
        });
     }  else{
        res.redirect('/login');
     }
}

// check the user is logged in or no 

const checkuser =  (req,res,next)=>{
    const token = req.cookies.jwt;
    if(token){
       jwt.verify(token,'my secrate key', async (err,decodedToken)=>{
        if(err){
            res.locals.user = null;
            next();
        }else{
            let user = await User.findById(decodedToken.id);
            res.locals.user = user;
            next(); 
        }
       });
    }else{
        res.locals.user = null;
        next();
   }
}

module.exports =  { requireAuth, checkuser }