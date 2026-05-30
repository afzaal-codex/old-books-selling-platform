import Author from "../models/Author.js";

const getAuthors = async (req, res) => {
  const authors = await Author.find();

  res.json(authors);
};

const getSingleAuthor = async (req, res) => {
  const author = await Author.findById(req.params.id);

  if (!author) {
    res.status(404);
    throw new Error("Author not found");
  }

  res.json(author);
};

const createAuthor = async (req, res) => {
  const author = await Author.create(req.body);

  res.status(201).json(author);
};

const updateAuthor = async (req, res) => {
  const author = await Author.findById(req.params.id);

  if (!author) {
    res.status(404);
    throw new Error("Author not found");
  }

  Object.assign(author, req.body);

  const updatedAuthor = await author.save();

  res.json(updatedAuthor);
};

const deleteAuthor = async (req, res) => {
  const author = await Author.findById(req.params.id);

  if (!author) {
    res.status(404);
    throw new Error("Author not found");
  }

  await author.deleteOne();

  res.json({
    success: true,
    message: "Author deleted",
  });
};

export {
  getAuthors,
  getSingleAuthor,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};