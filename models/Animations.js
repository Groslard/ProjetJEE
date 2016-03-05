/**
 * Created by m2tiil on 2/12/16.
 */
var mongoose = require('mongoose');



var AnimationSchema = new mongoose.Schema({
    titre: String,
    descriptif: String,
    imgPath: String,
    Option: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Option' }]
});



mongoose.model('AnimationBateau', AnimationSchema);
mongoose.model('AnimationSpectacle', AnimationSchema);
mongoose.model('AnimationRestauration', AnimationSchema);
