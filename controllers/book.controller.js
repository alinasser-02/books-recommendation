const express = require("express");
const router = express.Router();
// const Listing = require("../models");

router.get('/', (req,res)=>{
res.send('Welcome to Books listings page, hello world!')
})

module.exports = router;