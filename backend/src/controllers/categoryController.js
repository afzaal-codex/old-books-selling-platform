import Category from "../models/Category.js";

const getCategories = async (req, res) => {
  let query = {};
  if (!req.user?.isAdmin) {
    query.isActive = { $ne: false };
  }
  const categories = await Category.find(query);

  res.json(categories);
};

const getSingleCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  if (!req.user?.isAdmin && category.isActive === false) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.json(category);
};

const createCategory = async (req, res) => {
  const category = await Category.create(req.body);

  res.status(201).json(category);
};

const updateCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  Object.assign(category, req.body);

  const updatedCategory = await category.save();

  res.json(updatedCategory);
};

const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  await category.deleteOne();

  res.json({
    success: true,
    message: "Category deleted",
  });
};

export {
  getCategories,
  getSingleCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};