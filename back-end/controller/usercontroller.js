const user = require('../model/usermodel');
const jwt = require('jsonwebtoken');
const storage = require('node-persist');

storage.init();

exports.register = async (req, res) => {
    var data = await user.find({email: req.body.email});
    if(data.length == 0){
        var newuser = new user({
            name: req.body.name,
            email: req.body.email,
            no: req.body.no,
            add: req.body.add,
            city:req.body.city,
            gender:req.body.gender
    
        });
        var seveduser = await newuser.save();
        res.status(200).json({
            status:"user registered successfully",
        })
    }
    else{
        res.status(400).json({
            status:"user already exists",
        })
    }
}

