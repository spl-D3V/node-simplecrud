let mongoose = require('mongoose');
let User = mongoose.model('User',{
    name: { 
        type: String,
        required: true,
        minlength:1,
        trim: true
     },
     email: { 
        type: String,
        required: true,
        minlength:1,
        trim: true
     },
    age:{
        type: Number,
        default: null
    }
});
module.exports = {User};