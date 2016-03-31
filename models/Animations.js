/**
 * Created by m2tiil on 2/12/16.
 */
var mongoose = require('mongoose');



var AnimationSchema = new mongoose.Schema({
    titre: String,
    descriptif: String,
    typeAnim: String,
    imgPath: String,
    Option: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Option' }],
    date: Date
});



mongoose.model('Animation', AnimationSchema);

