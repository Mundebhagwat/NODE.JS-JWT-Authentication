const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require ('bcrypt');
const userSchema = new mongoose.Schema({
    email:{
        type : String,
        unique : true,
        required : [true, 'please enter an email'],
        lowercase : true,
        validate : [isEmail,'please enter an valid email']
    },
    password:{
        type: String,
        required: [true,'please enter a password'],
        minlength : [6,'please enter minimun charater 6 '],
    }
});

// function run after the document sved into the data base
// userSchema.post('save', function(doc,next){
//     console.log("The function runs after the document saved to the data base", doc);
//     next();
// })

// function run before the document saved into the data base
userSchema.pre('save', async function(next){
    const salt =await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
})


// static method for login 
userSchema.statics.login = async function(email,password){
 const user = await this.findOne({email});
 if(user){
   const auth = await bcrypt.compare(password,user.password)
   if(auth){
    return user;
   }
   throw Error("Incorrect password")
 }
 throw Error("Incorrect email")
};

const User = mongoose.model('user', userSchema)

module.exports = User;