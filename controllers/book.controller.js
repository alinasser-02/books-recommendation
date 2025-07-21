const express = require("express");
const router = express.Router();
const Book = require('../models/book.js')
router.get('/', (req,res)=>{
res.render('books/index.ejs')
})

router.get('/new', async (req,res)=>{
res.render('books/new.ejs')
})

router.post('/',async (req,res)=>{
 await Book.create(req.body)
res.redirect('/books/new')
})

router.get('/', async (req,res)=>{
  const foundBooks = await Book.find()
res.render('/books', {foundBooks:foundBooks})
console.log(req.body)
})
module.exports = router;


