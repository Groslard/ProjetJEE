/**
 * Created by m2tiil on 2/12/16.
 */
var mongoose = require('mongoose');



var OptionSchema = new mongoose.Schema({
    titre: String,
    description: String,
    duree: Number,
    nbMaxUser: Number,
    animation: { type: mongoose.Schema.Types.ObjectId, ref: 'Animation' },
    creneaux: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Creneaux' }]
});



mongoose.model('Option', OptionSchema);
