const express = require("express");
const router = express.Router();
const Book = require("../models/book");

router.get("/new", (req, res) => {
  res.render("books/new.ejs");
});

router.post("/", async (req, res) => {
  await Book.create(req.body);
  res.redirect("/books/new");
});

router.get("/", async (req, res) => {
  const foundBooks = await Book.find();
  res.render("books/index.ejs", { foundBooks });
  console.log(req.body);
});

router.get("/:bookId", async (req, res) => {
  const foundBook = await Book.findById(req.params.bookId);
  res.render('books/show.ejs',{})
});
module.exports = router;
