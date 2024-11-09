const mongoose =require('mongoose');
mongoose.connect('mongodb://localhost:27017/testapp1');

const sellerschema =mongoose.Schema({
    name:String,
    email:String,
    bio:String,
    qualification:String,
    skills:String,
    residence:String
});

module.exports= mongoose.model('seller',sellerschema);