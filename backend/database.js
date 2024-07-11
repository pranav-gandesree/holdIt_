const mongoose = require('mongoose');

const connectDB = async()=>{
    return mongoose.connect(process.env.MONGO_URL)
    .then(()=>{console.log('connected to databse')})
    .catch((err)=>{console.log(err)});
}

module.exports = connectDB;
