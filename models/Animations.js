/**
 * Created by m2tiil on 2/12/16.
 */
var mongoose = require('mongoose');



var AnimationSchema = new mongoose.Schema({
    titre: String,
    descriptif: String,
    typeAnim: String,
    imgPath: String,
    options: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Option' }]
});



mongoose.model('Animation', AnimationSchema);

