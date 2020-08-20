const mongoose= require('mongoose');

mongoose.connect('mongodb+srv://hetvi955:hetvi955@testcluster1-9u71o.mongodb.net/uploads?retryWrites=true&w=majority',
{
    useNewUrlParser: true,
    useUnifiedTopology: true 
});

const conn= mongoose.connection;

const uploadSchema= new mongoose.Schema({
    filename: String,
});

var uploadModel= mongoose.model('uploads', uploadSchema);

module.exports= uploadModel;


    