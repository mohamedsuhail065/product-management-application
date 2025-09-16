const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ message: "Category name is required" });
    const categoryExists = await Category.findOne({ name });
    if (categoryExists)
      return res.status(400).json({ message: "Category already exists" });
    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSubCategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    if (!name || !categoryId)
      return res
        .status(400)
        .json({ message: "Sub-category name and category ID are required" });
    const subcategoryExists = await SubCategory.findOne({
      name,
      category: categoryId,
    });
    if (subcategoryExists)
      return res
        .status(400)
        .json({ message: "Sub-category already exists in this category" });
    const subcategory = await SubCategory.create({
      name,
      category: categoryId,
    });
    res.status(201).json(subcategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSubCategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subcategories = await SubCategory.find({ category: categoryId });
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createCategory,
  getCategories,
  createSubCategory,
  getSubCategoriesByCategory,
};
