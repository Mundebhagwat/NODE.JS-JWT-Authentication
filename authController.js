const User = require('../model/User')
const jwt = require('jsonwebtoken')

// Error handling

 const handleErrors = (err) =>{
    let errors = { email : '', password: ''}


//   login errors
 if(err.message==='Incorrect email'){
    errors.email = 'That email is not registerd';
 }
 if(err.message === 'Incorrect password'){
    errors.password = 'The password is incorrect';
 }
  

//    duplicate email checker
    if(err.code === 11000){
        errors.email =  "That email is already registerd"
        return errors;
    }

    // validation

    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            // console.log(properties);
            errors[properties.path] = properties.message; 
        })
       
    }
    return errors;
 
}
// create jwt tokens
const maxAge = 30;
const createToken = (id) =>{
   return jwt.sign({id},'my secrate key',{
    expiresIn: maxAge
   })
}


//  Controllers action
const singup_get = (req,res)=>{
   res.render('singup')
}

const login_get = (req,res) =>{
    res.render('login')
}

const singup_post = async (req,res)=>{
    const { email, password} = req.body;
    try{
      const user = await User.create({email,password});
      const token = createToken(user._id);
      res.cookie('jwt',token,{ httpOnly : true, maxAge : maxAge *1000 });
      res.status(201).json({user: user._id})
    }catch(err){
      const errors = handleErrors(err);
      res.status(400).json({errors})
    }
}
const login_post = async (req,res) =>{
    const { email, password} = req.body
    try{


       const user = await User.login(email, password);
       const token = createToken(user._id);
       res.cookie('jwt',token,{httpOnly: true, maxAge: maxAge * 100});
       console.log('Max Age in milliseconds:', maxAge * 1000);
       res.status(200).json({user : user._id})

    }catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}
const logout_get = (req,res) =>{
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/');
}

module.exports = {singup_post, singup_get, login_get, login_post, logout_get}