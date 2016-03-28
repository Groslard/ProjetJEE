var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    nom: {type: String, lowercase: true, unique: true},
    code: String,
    creneaux: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Creneaux' }]
});

UserSchema.methods.validCode = function (code) {
    return this.code === code;
};

UserSchema.methods.generateJWT = function () {
    // set expiration to 1 day
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 1);

    return jwt.sign({
        _id: this._id,
        nom: this.nom,
        exp: parseInt(exp.getTime() / 1000)
    }, 'SECRET');

};

mongoose.model('User', UserSchema);