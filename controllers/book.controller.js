const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const isSignedIn = require("../middleware/is-signed-in");

router.get("/new", isSignedIn, (req, res) => {
  res.render("books/new.ejs");
});

router.post("/", isSignedIn, async (req, res) => {
  try {
    req.body.user = req.session.user._id;
    await Book.create(req.body);
    res.redirect("/books");
  } catch (error) {
    console.log(error);
    res.send("Something went wrong");
  }
});

router.get("/", async (req, res) => {
  const foundBooks = await Book.find();
  res.render("books/index.ejs", { foundBooks });
  console.log(req.body);
});

router.get("/:bookId", async (req, res) => {
  try {
    const foundBook = await Book.findById(req.params.bookId).populate("user");
    res.render("books/show.ejs", { foundBook: foundBook });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.delete("/:bookId", isSignedIn, async (req, res) => {
  const foundBook = await Book.findById(req.params.bookId).populate("user");
  if (foundBook.user._id.equals(req.session.user._id)) {
    await foundBook.deleteOne();
    return res.redirect("/books");
  }
  return res.send("only owner can delete");
});

module.exports = router;
