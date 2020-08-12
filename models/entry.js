const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const entrySchema = new mongoose.Schema({
    user :{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required : true
    },
    title:{
        type : String,
        required : false
    },
    memo :{
        type : String,
        required : false
    },
    temperature :{
        type : mongoose.Types.Decimal128,
        required : false
    },
    date :{
        type : Date,
        default : Date.now
    }
});

entrySchema.plugin(autoIncrement.plugin, {model:'Entry', field:'EntryId'});
const Entry = mongoose.model('Entry', entrySchema)


module.exports = Entry;