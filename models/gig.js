const mongoose =require('mongoose');
mongoose.connect('mongodb://localhost:27017/testapp1');

const gigschema =mongoose.Schema({
    title:String,
    price:Number,
    category:String,
    description:String,
    workexperience: String,
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller', // Make sure 'Seller' matches the name of your seller model
        required: true
    }
});

module.exports= mongoose.model('gig',gigschema);