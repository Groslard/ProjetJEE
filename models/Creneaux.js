/**
 * Created by m2tiil on 2/12/16.
 */
var mongoose = require('mongoose');



var CreneauSchema = new mongoose.Schema({
    fin:Number,
    debut: Number,
    option: { type: mongoose.Schema.Types.ObjectId, ref: 'Option' },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }]
});



mongoose.model('Creneau', CreneauSchema);