const User = require('../models/User');
const router = require('express').Router();
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken');
const CryptoJS = require('crypto-js');

//update User
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new:true});
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});
//Delete
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json('User has been Deleted Successfully!');
    } catch (err) {
        res.status(500).json(err);
    }
});
//Get User
router.get('/:id', verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new
    try {
        const users = query ? await User.find().sort({_id: -1}).limit(5) : User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});
//Get User Statistics
router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYaer = new Date(date.setFullYear(date.getFullYear() -1 ));
    try {
        const data = await User.aggregate([
            {$match: {createdAt: {$gte: lastYaer}}},
            {$project: {month:{$month: '$createdAt'}}},
            {$group: {_id: "$month", total: {$sum: 1}}}
        ]);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = { verifyTokenAndAdmin, verifyToken, verifyTokenAndAuthorization };