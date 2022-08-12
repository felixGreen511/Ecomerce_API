const Cart = require('../models/Cart');
const router = require('express').Router();
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken');
//Create Product
router.post('/', verifyToken, async (req, res) => {
    const newCart = new Cart(req.body);
    try {
        const savedCarts = await newCart.save();
        res.status(200).json(savedCarts);
    } catch (err) {
        res.status(500).json(err);
    }
});
//update Products
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => { 
    try {
        const updatedCarts = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new:true});
        res.status(200).json(updatedCarts);
    } catch (err) {
        res.status(500).json(err);
    }
});
//Delete Cart 
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json('Cart has been Deleted Successfully!');
    } catch (err) {
        res.status(500).json(err);
    }
});
//Get User Cart
router.get('/find/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const cart =  await Cart.findOne({userId: req.params.userId});
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err);
    }
});
//Get All Cart Records
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        req.status(200).json(carts);
    } catch (err) {
        res.status(500).json(err);   
    }
});


module.exports = router