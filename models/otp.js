const mongoose = require('mongoose');


var otpSchema = new mongoose.Schema({
    email: String,
    code: String,
    expireIn : Number
},{
    timestamps: true

})

module.exports = mongoose.model("otp",otpSchema);