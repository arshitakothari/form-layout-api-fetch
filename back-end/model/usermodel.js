const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    no:{
        type:Number
    },
    add:{
        type:String
    },
    city:{
        type:String
    },
    gender:{
        type:String
    }
})

module.exports = mongoose.model('login',UserSchema)  