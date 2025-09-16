const express = require("express");
const {
  createCategory,
  getCategories,
  createSubCategory,
  getSubCategoriesByCategory,
} = require("../controllers/CategoryCtrl");
const categoryRouter = express.Router();

categoryRouter.post("/", createCategory);
categoryRouter.get("/", getCategories);
categoryRouter.post("/subcategory", createSubCategory);
categoryRouter.get("/subcategory/:categoryId", getSubCategoriesByCategory);
module.exports = categoryRouter;
