const mongoose =require('mongoose');
mongoose.connect('mongodb://localhost:27017/testapp1');

const userschema =mongoose.Schema({
    name:String,
    email:String,
    password:String,
    age:Number
});

module.exports= mongoose.model('user',userschema);