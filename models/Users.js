var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    nom: {type: String, lowercase: true, unique: true},
    code: String
});

UserSchema.methods.setCode = function(code){
    this.code = code;
};

UserSchema.methods.validPassword = function(code) {
    return this.hash === code;
};


mongoose.model('User', UserSchema);