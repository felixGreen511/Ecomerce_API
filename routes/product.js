const Product = require('../models/Product');
const router = require('express').Router();
const { verifyTokenAndAdmin} = require('./verifyToken');
//Create Product
router.post('/', verifyTokenAndAdmin, async (req, res) => {
    const newProducts = new Product(req.body);
    try {
        const savedProducts = await newProducts.save();
        res.status(200).json(savedProducts);
    } catch (err) {
        res.status(500).json(err);
    }
});
//update Products
router.put('/:id', verifyTokenAndAdmin, async (req, res) => { 
    try {
        const updatedProducts = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new:true});
        res.status(200).json(updatedProducts);
    } catch (err) {
        res.status(500).json(err);
    }
});
//Delete Products 
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json('Product has been Deleted Successfully!');
    } catch (err) {
        res.status(500).json(err);
    }
});
//Get Single Product
router.get('/:id', async (req, res) => {
    try {
        const product =  await Product.find(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
});
//Get All Products
router.get('/', async (req, res) => {
    const qNew = req.query.new
    const qCategory = req.query.category
    try {
       let products;
       if(qNew){
           products = await Product.find().sort({createdAt: -   1}).limit(5);
       }else if(qCategory){
           products = await Product.find({categories: {$in: [qCategory],},});
       }else{
           products = await Product.find();
       }
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router