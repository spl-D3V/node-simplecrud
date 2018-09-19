const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

let UserSchema = new mongoose.Schema({
    email: { 
        type: String,
        required: true,
        minlength:1,
        trim: true,
        unique: true,
        validate:{
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
     },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});
UserSchema.statics.findByToken = function(token){
    let user = this;
    let decoded;
    try{
        decoded = jwt.verify(token, 'itsasecret');
    }catch(e){
        return Promise.reject('fallos');
    };
    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};
UserSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
};
UserSchema.methods.generateAuthToken = function(){
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id: user._id.toHexString(), access}, 'itsasecret').toString();
    user.tokens.push({access, token});
    return user.save().then(() => {
        return token;
    });
};
UserSchema.pre('save', function(next){
    let user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err, salt) =>{
            bcrypt.hash(user.password, salt, (err, hash) =>{
                user.password = hash;
                next();
            });
        });
    }else{
        next();
    }
});

let User = mongoose.model('Users', UserSchema);
module.exports = {User};