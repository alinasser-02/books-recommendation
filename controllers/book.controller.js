const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const isSignedIn = require("../middleware/is-signed-in");
const User = require("../models/user");


router.get("/new", isSignedIn, (req, res) => {
  res.render("books/new.ejs");
});

router.post("/", isSignedIn, async (req, res) => {
  try {
    req.body.recommender = req.session.user._id;
    await Book.create(req.body);
    res.redirect("/books");
  } catch (error) {
    res.send("Something went wrong");
  }
});

router.get("/", async (req, res) => {
  const foundBooks = await Book.find();
  res.render("books/index.ejs", { foundBooks });
});

router.get('/readlist', isSignedIn, async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id).populate('readList');
    res.render('books/readlist.ejs', { readList: user.readList, user });
  } catch (err) {
    res.send('Error loading readlist');
  }
});


router.get("/:bookId", async (req, res) => {
  try {
    const foundBook = await Book.findById(req.params.bookId).populate("recommender");
    res.render("books/show.ejs", { foundBook: foundBook });
  } catch (error) {
    res.redirect("/");
  }
});


router.post('/:bookId/readlist', isSignedIn, async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    const bookId = req.params.bookId;

    if (!user.readList.includes(bookId)) {
      user.readList.push(bookId);
      await user.save();
    }

    res.redirect('/books/' + bookId);
  } catch (err) {
    res.send('Error adding to readlist');
  }
});

router.delete('/:bookId/readlist', isSignedIn, async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    const bookId = req.params.bookId;

    user.readList = user.readList.filter(id => id.toString() !== bookId);
    await user.save();

    res.redirect('/books/readlist');
  } catch (err) {
    res.send('Error removing from readlist');
  }
});


router.delete("/:bookId", isSignedIn, async (req, res) => {
  const foundBook = await Book.findById(req.params.bookId).populate("recommender");
  if (foundBook.recommender._id.equals(req.session.user._id)) {
    await foundBook.deleteOne();
    return res.redirect("/books");
  }
  return res.send("only owner can delete this book");
});

router.get("/:bookId/edit", isSignedIn, async (req, res) => {
  const foundBook = await Book.findById(req.params.bookId).populate("recommender");
  if(foundBook.recommender._id.equals(req.session.user._id))
  {
    return res.render('books/edit.ejs', {foundBook})
  }
     res.send("only owner can edit this book");
});

router.put('/:bookId', async (req,res)=>{
await Book.findByIdAndUpdate(req.params.bookId, req.body)
res.redirect(`/books/${req.params.bookId}`)
})


module.exports = router
