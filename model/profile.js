var mongoose = require('mongoose');

var ProfileSchema = mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    department:{
        type: String,
        required: true
    },
    hiredate:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    }
 
});
var Profile = module.exports = mongoose.model('Profile', ProfileSchema);
